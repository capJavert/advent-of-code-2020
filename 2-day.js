require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const entryMatch = /(?<min>[0-9]{1,})-(?<max>[0-9]{1,}) (?<letter>[a-z]{1}): (?<password>.*)/

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/DQmUx2Zb').then((response) => response.text())
    const input = data.split(/\r?\n/)
    const entries = input.reduce((acc, item) => {
        const {
            min, max, letter, password,
        } = item.match(entryMatch).groups

        acc.push({
            min: +min, max: +max, letter, password,
        })

        return acc
    }, [])

    const invalidCount = entries.reduce((acc, {
        min, max, letter, password,
    }) => {
        if ((password[min - 1] === letter && password[max - 1] === letter)
        || (password[min - 1] !== letter && password[max - 1] !== letter)) {
            return acc
        }

        return acc + 1
    }, 0)

    console.log(invalidCount)
}

main()
