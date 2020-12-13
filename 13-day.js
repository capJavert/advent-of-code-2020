require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/tSvDRbS4').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const [estimate, buses] = input

    const result = buses.split(',').reduce((acc, item) => {
        if (item !== 'x') {
            let departure = 0

            while (departure < +estimate) {
                departure += +item
            }

            const diff = departure - +estimate

            if (diff < acc.diff) {
                return { id: +item, diff }
            }
        }

        return acc
    }, { id: null, diff: Infinity })

    console.log(result.id * result.diff)
}

main()
