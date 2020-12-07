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

    let bagSum = 0

    const findBag = (bags, parent, id, modifier) => {
        bags.forEach((bag) => {
            bagSum += parent[bag] * modifier
            findBag(Object.keys(rules[bag]), rules[bag], bag, parent[bag] * modifier)
        })
    }

    findBag(Object.keys(rules[myBag]), rules[myBag], myBag, 1)

    console.log(bagSum)
}

main()
