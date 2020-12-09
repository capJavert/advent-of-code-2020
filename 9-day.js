require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/30RVzPii').then((response) => response.text())
    const input = data.split(/\r?\n/)
    const contiguousInput = 144381670 // result from part 1

    let result = []
    let acc = 0

    input.filter((item) => +item !== contiguousInput)
        .some((_, index, array) => array.slice(index).some((item) => {
            if (acc === contiguousInput) {
                return true
            }

            result.push(+item)
            acc += +item

            if (acc > contiguousInput) {
                result = []
                acc = 0
            }

            return false
        }, 0), 0)

    const sortedResult = result.sort((a, b) => a - b)

    console.log(sortedResult[0] + sortedResult[sortedResult.length - 1])
}

main()
