require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/4K220iZj').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const validator = {
        byr: {
            test: (value) => +value >= 1920 && +value <= 2002
        },
        iyr: {
            test: (value) => +value >= 2010 && +value <= 2020
        },
        eyr: {
            test: (value) => +value >= 2020 && +value <= 2030
        },
        hgt: {
            test: (value) => {
                if (value.includes('cm')) {
                    const height = +value.replace('cm', '')

                    return +height >= 150 && +height <= 193
                }

                if (value.includes('in')) {
                    const height = +value.replace('in', '')

                    return +height >= 59 && +height <= 76
                }

                return false
            }
        },
        hcl: {
            test: (value) => {
                const match = /#[0-9a-f]{6}/

                return match.test(value)
            }
        },
        ecl: {
            test: (value) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value)
        },
        pid: {
            test: (value) => {
                const match = /[0-9]{9}/

                return match.test(value)
            }
        }
    }

    const validPassports = input.reduce((acc, line, index) => {
        let passport = acc[acc.length - 1]

        if (!passport) {
            acc.push({})
            passport = acc[acc.length - 1]
        }

        if (line === '' || index === input.length - 1) {
            const passportFields = Object.keys(passport)

            if (passport && !['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'].every((field) => {
                if (!passportFields.includes(field)) {
                    return false
                }

                return validator[field].test(passport[field])
            })) {
                acc.pop()
            }

            if (index < input.length - 1) {
                acc.push({})
            }
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
