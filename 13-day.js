require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/tSvDRbS4').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const [, buses] = input

    const result = buses.split(',').reduce((acc, item, index) => {
        if (index === 0) {
            acc.timestamp = +item
            acc.step = +item

            return acc
        }

        if (item !== 'x') {
            while ((acc.timestamp + index) % +item !== 0) {
                acc.timestamp += acc.step
            }

            acc.step *= +item
        }

        return acc
    }, { timestamp: 0, step: 0 })

    console.log(result.timestamp)
}

main()
