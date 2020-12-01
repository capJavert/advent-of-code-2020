require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/aCwSGieB').then((response) => response.text())
    const input = data.split(/\r?\n/)

    let a
    let b
    let c

    input.some((num1) => input.some((num2) => input.some((num3) => {
        if (+num1 + +num2 + +num3 === 2020) {
            a = +num1
            b = +num2
            c = +num3

            return true
        }

        return false
    })))

    console.log(a * b * c)
}

main()
