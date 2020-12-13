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
            switch (acc.direction) {
            case 0:
                acc.waypoint.y += +value
                break;
            case 90:
                acc.waypoint.x -= +value
                break;
            case 180:
                acc.waypoint.y -= +value
                break;
            case 270:
                acc.waypoint.x += +value
                break;
            default:
                throw new Error(`Unknown direction '${acc.direction}'`)
            }
            break;
        case 'S':
            switch (acc.direction) {
            case 0:
                acc.waypoint.y -= +value
                break;
            case 90:
                acc.waypoint.x += +value
                break;
            case 180:
                acc.waypoint.y += +value
                break;
            case 270:
                acc.waypoint.x -= +value
                break;
            default:
                throw new Error(`Unknown direction '${acc.direction}'`)
            }
            break;
        case 'E':
            switch (acc.direction) {
            case 0:
                acc.waypoint.x += +value
                break;
            case 90:
                acc.waypoint.y += +value
                break;
            case 180:
                acc.waypoint.x -= +value
                break;
            case 270:
                acc.waypoint.y -= +value
                break;
            default:
                throw new Error(`Unknown direction '${acc.direction}'`)
            }
            break;
        case 'W':
            switch (acc.direction) {
            case 0:
                acc.waypoint.x -= +value
                break;
            case 90:
                acc.waypoint.y -= +value
                break;
            case 180:
                acc.waypoint.x += +value
                break;
            case 270:
                acc.waypoint.y += +value
                break;
            default:
                throw new Error(`Unknown direction '${acc.direction}'`)
            }
            break;
        case 'L':
            acc.direction = (360 + (acc.direction - +value)) % 360
            break
        case 'R':
            acc.direction = (360 + (acc.direction + +value)) % 360
            break
        case 'F':
            switch (acc.direction) {
            case 0:
                acc.x += acc.waypoint.x * +value
                acc.y += acc.waypoint.y * +value
                break;
            case 90:
                acc.x += acc.waypoint.y * +value
                acc.y += acc.waypoint.x * +value * -1
                break;
            case 180:
                acc.x += acc.waypoint.x * +value * -1
                acc.y += acc.waypoint.y * +value * -1
                break;
            case 270:
                acc.x += acc.waypoint.y * +value * -1
                acc.y += acc.waypoint.x * +value
                break;
            default:
                throw new Error(`Unknown direction '${acc.direction}'`)
            }
            break
        default:
            throw new Error(`Unknown action '${action}'`)
        }

        return acc
    }, {
        x: 0, y: 0, direction: 0, waypoint: { x: 10, y: 1 }
    })

    console.log(Math.abs(result.x) + Math.abs(result.y))
}

main()
