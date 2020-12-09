require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const preambleLength = 25

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/30RVzPii').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const cypher = input.slice(preambleLength, input.length)

    const result = cypher.find((item, index) => {
        const preamble = input.slice(index, index + preambleLength)

        return !preamble.some((a) => preamble.some((b) => {
            if (+a === +b) {
                return false
            }

            return +a + +b === +item
        }))
    })

    console.log(result)
}

main()
