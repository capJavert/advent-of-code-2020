require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const myBag = 'shiny gold'

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/V6w7YVNT').then((response) => response.text())
    const input = data.split(/\r?\n/)
    const bagNames = {}

    const rules = input.reduce((acc, line) => {
        const [mainBag, rest] = line.split(' bags contain ')

        bagNames[mainBag] = mainBag

        const bags = rest !== 'no other bags.' ? rest.split(', ').reduce((acc2, item) => {
            const bag = {
                quantity: +item.substr(0, 1),
                name: item.substr(2).replace('.', '').replace(' bags', '').replace(' bag', '')
            }

            bagNames[bag.name] = bag.name

            return {
                ...acc2,
                [bag.name]: bag.quantity
            }
        }, {}) : {}

        return {
            ...acc,
            [mainBag]: bags
        }
    }, {})

    const matchedBags = {}

    Object.keys(rules).forEach((rule) => {
        if (rules[rule][myBag]) {
            matchedBags[rule] = true
        }
    })

    const matches = {}

    const findBag = (bags, path = [], current, id) => {
        const isMatch = bags.some((bag) => bag === myBag)

        if (bags.length === 0) {
            return path
        }

        if (isMatch) {
            matches[id] = true
            return [true]
        }

        return [
            ...path,
            ...bags.map((bag) => findBag(Object.keys(rules[bag]), [
                ...path,
                bag
            ], bag, id))
        ]
    }

    Object.keys(bagNames).forEach((name) => {
        const bags = rules[name]

        findBag(Object.keys(bags), [name], name, name)
    })

    console.log(Object.keys(matches).length)
}

main()
