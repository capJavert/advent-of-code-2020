require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/ZGbnYLaq').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const result = input.reduce((acc, item, index, array) => {
        if (item === '') {
            return acc
        }

        if (!acc.groups[acc.current]) {
            acc.groups[acc.current] = {}
            acc.members = 0
        }

        const group = acc.groups[acc.current]
        acc.members += 1

        item.split('').forEach((answer) => {
            group[answer] = (group[answer] || 0) + 1
        })

        if (array[index + 1] === '' || index === array.length - 1) {
            acc.yeses += Object.values(group)
                .filter((count) => count === acc.members).length
            acc.current += 1
        }

        return acc
    }, { groups: {}, current: 0, yeses: 0 })

    console.log(result.yeses)
}

main()
