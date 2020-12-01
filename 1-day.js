require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/aCwSGieB').then((response) => response.text())
    const input = data.split(/\r?\n/)

    let a
    let b

    input.some((num1) => input.some((num2) => {
        if (+num1 + +num2 === 2020) {
            a = +num1
            b = +num2

            return true
        }

        return false
    }))

    console.log(a * b)
}

main()
