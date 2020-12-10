require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/2fRQjvvr').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const ordered = input.map((item) => +item).sort((a, b) => +a - +b)

    const result = [0, ...ordered, ordered[ordered.length - 1] + 3]
        .reduce((acc, item, index, array) => {
            if (index > 0) {
                const diff = item - array[index - 1]

                if (!acc[diff]) {
                    acc[diff] = 0
                }

                acc[diff] += 1
            }

            return acc
        }, {})

    console.log(result[1] * result[3])
}

main()
