require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const actionMatch = /(?<action>[A-Z]{1})(?<value>[0-9]{1,})/

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/MFe2fsiB').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const result = input.reduce((acc, item) => {
        const { action, value } = item.match(actionMatch).groups

        switch (action) {
        case 'N':
            acc.y -= +value
            break
        case 'S':
            acc.y += +value
            break
        case 'E':
            acc.x += +value
            break
        case 'W':
            acc.x -= +value
            break
        case 'L':
            acc.direction = (360 + (acc.direction - +value)) % 360
            break
        case 'R':
            acc.direction = (360 + (acc.direction + +value)) % 360
            break
        case 'F':
            switch (acc.direction) {
            case 90:
                acc.x += +value
                break
            case 180:
                acc.y += +value
                break
            case 270:
                acc.x -= +value
                break
            case 0:
                acc.y -= +value
                break
            default:
                throw new Error(`Unknown direction '${acc.direction}'`)
            }
            break
        default:
            throw new Error(`Unknown action '${action}'`)
        }

        return acc
    }, { x: 0, y: 0, direction: 90 })

    console.log(Math.abs(result.x) + Math.abs(result.y))
}

main()
