require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/KEnP81J1').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const grid = new Map()

    const getNeighbors = (id) => {
        const [x, y, z] = id.split(':')
        const position = { x: +x, y: +y, z: +z }

        return [
            `${position.x + 1}:${position.y - 1}:${position.z}`,
            `${position.x}:${position.y - 1}:${position.z + 1}`,
            `${position.x - 1}:${position.y}:${position.z + 1}`,
            `${position.x - 1}:${position.y + 1}:${position.z}`,
            `${position.x}:${position.y + 1}:${position.z - 1}`,
            `${position.x + 1}:${position.y}:${position.z - 1}`
        ]
    }

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

        getNeighbors(id).forEach((neighborId) => {
            const neighborState = grid.get(neighborId)

            if (!neighborState) {
                grid.set(neighborId, 'white')
            }
        })
    })

    for (let i = 0; i < 100; i += 1) {
        const temp = new Map(grid)
        const entries = temp.entries()
        let item = entries.next()

        const flip = (id, state) => {
            const neighbors = getNeighbors(id)

            const stats = neighbors.reduce((acc, neighborId) => {
                const neighborState = temp.get(neighborId)

                if (!neighborState) {
                    grid.set(neighborId, 'white')
                }

                if (neighborState === 'black') {
                    acc.black += 1
                }

                if (neighborState === 'white') {
                    acc.white += 1
                }

                return acc
            }, { black: 0, white: 0 })

            if (state === 'black' && (stats.black === 0 || stats.black > 2)) {
                grid.set(id, 'white')
            }

            if (state === 'white' && stats.black === 2) {
                grid.set(id, 'black')
            }
        }

        while (!item.done) {
            const [id, state] = item.value
            flip(id, state)

            item = entries.next()
        }
    }

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
