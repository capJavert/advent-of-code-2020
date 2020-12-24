require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/KEnP81J1').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const grid = new Map()

    input.forEach((item) => {
        const position = { x: 0, y: 0, z: 0 }
        let direction = ''

        item.split('').forEach((item2) => {
            let matched = true
            direction += item2

            switch (direction) {
            case 'e':
                position.x += 1
                position.y -= 1
                break
            case 'se':
                position.y -= 1
                position.z += 1
                break
            case 'sw':
                position.x -= 1
                position.z += 1
                break
            case 'w':
                position.x -= 1
                position.y += 1
                break
            case 'nw':
                position.y += 1
                position.z -= 1
                break
            case 'ne':
                position.z -= 1
                position.x += 1
                break
            default:
                matched = false
            }

            if (matched) {
                direction = ''
            }
        })

        const id = `${position.x}:${position.y}:${position.z}`
        const state = grid.get(id) || 'white'
        grid.set(id, state === 'black' ? 'white' : 'black')
    })

    const values = grid.values()
    let item = values.next()
    let result = 0

    while (!item.done) {
        if (item.value === 'black') {
            result += 1
        }

        item = values.next()
    }

    console.log(result)
}

main()
