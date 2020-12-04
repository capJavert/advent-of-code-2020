require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/4K220iZj').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const validPassports = input.reduce((acc, line, index) => {
        let passport = acc[acc.length - 1]

        if (!passport) {
            acc.push({})
            passport = acc[acc.length - 1]
        }

        if (line === '' || index === input.length - 1) {
            const passportFields = Object.keys(passport)

            if (passport && !['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'].every((field) => passportFields.includes(field))) {
                acc.pop()
            }

            acc.push({})
        } else {
            const newFields = line.split(' ')
            passport = newFields.forEach((field) => {
                const [name, value] = field.split(':')

                passport[name] = value
            })
        }

        return acc
    }, [])

    console.log(validPassports.length)
}

main()
