require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/2fRQjvvr').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const ordered = input.map((item) => +item).sort((a, b) => +a - +b)

    const result = ordered.reduce((acc, item) => {
        acc[item] = (acc[item - 3] || 0) + (acc[item - 2] || 0) + (acc[item - 1] || 0)

        return acc
    }, [1])

    console.log(result[result.length - 1])
}

main()
