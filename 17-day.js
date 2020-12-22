require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const createPermutations = (coords) => {
    const [x, y, z, w] = coords.map((item) => +item)

    return [
        [x, y, z, w - 1],
        [x, y, z - 1, w - 1],
        [x - 1, y - 1, z - 1, w - 1],
        [x + 0, y - 1, z - 1, w - 1],
        [x + 1, y - 1, z - 1, w - 1],
        [x - 1, y + 0, z - 1, w - 1],
        [x + 1, y + 0, z - 1, w - 1],
        [x - 1, y + 1, z - 1, w - 1],
        [x + 0, y + 1, z - 1, w - 1],
        [x + 1, y + 1, z - 1, w - 1],
        [x - 1, y - 1, z, w - 1],
        [x + 0, y - 1, z, w - 1],
        [x + 1, y - 1, z, w - 1],
        [x - 1, y + 0, z, w - 1],
        [x + 1, y + 0, z, w - 1],
        [x - 1, y + 1, z, w - 1],
        [x + 0, y + 1, z, w - 1],
        [x + 1, y + 1, z, w - 1],
        [x, y, z + 1, w - 1],
        [x - 1, y - 1, z + 1, w - 1],
        [x + 0, y - 1, z + 1, w - 1],
        [x + 1, y - 1, z + 1, w - 1],
        [x - 1, y + 0, z + 1, w - 1],
        [x + 1, y + 0, z + 1, w - 1],
        [x - 1, y + 1, z + 1, w - 1],
        [x + 0, y + 1, z + 1, w - 1],
        [x + 1, y + 1, z + 1, w - 1],

        [x, y, z - 1, w],
        [x - 1, y - 1, z - 1, w],
        [x + 0, y - 1, z - 1, w],
        [x + 1, y - 1, z - 1, w],
        [x - 1, y + 0, z - 1, w],
        [x + 1, y + 0, z - 1, w],
        [x - 1, y + 1, z - 1, w],
        [x + 0, y + 1, z - 1, w],
        [x + 1, y + 1, z - 1, w],
        [x - 1, y - 1, z, w],
        [x + 0, y - 1, z, w],
        [x + 1, y - 1, z, w],
        [x - 1, y + 0, z, w],
        [x + 1, y + 0, z, w],
        [x - 1, y + 1, z, w],
        [x + 0, y + 1, z, w],
        [x + 1, y + 1, z, w],
        [x, y, z + 1, w],
        [x - 1, y - 1, z + 1, w],
        [x + 0, y - 1, z + 1, w],
        [x + 1, y - 1, z + 1, w],
        [x - 1, y + 0, z + 1, w],
        [x + 1, y + 0, z + 1, w],
        [x - 1, y + 1, z + 1, w],
        [x + 0, y + 1, z + 1, w],
        [x + 1, y + 1, z + 1, w],

        [x, y, z, w + 1],
        [x, y, z - 1, w + 1],
        [x - 1, y - 1, z - 1, w + 1],
        [x + 0, y - 1, z - 1, w + 1],
        [x + 1, y - 1, z - 1, w + 1],
        [x - 1, y + 0, z - 1, w + 1],
        [x + 1, y + 0, z - 1, w + 1],
        [x - 1, y + 1, z - 1, w + 1],
        [x + 0, y + 1, z - 1, w + 1],
        [x + 1, y + 1, z - 1, w + 1],
        [x - 1, y - 1, z, w + 1],
        [x + 0, y - 1, z, w + 1],
        [x + 1, y - 1, z, w + 1],
        [x - 1, y + 0, z, w + 1],
        [x + 1, y + 0, z, w + 1],
        [x - 1, y + 1, z, w + 1],
        [x + 0, y + 1, z, w + 1],
        [x + 1, y + 1, z, w + 1],
        [x, y, z + 1, w + 1],
        [x - 1, y - 1, z + 1, w + 1],
        [x + 0, y - 1, z + 1, w + 1],
        [x + 1, y - 1, z + 1, w + 1],
        [x - 1, y + 0, z + 1, w + 1],
        [x + 1, y + 0, z + 1, w + 1],
        [x - 1, y + 1, z + 1, w + 1],
        [x + 0, y + 1, z + 1, w + 1],
        [x + 1, y + 1, z + 1, w + 1]
    ]
}

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/GzSQAza9').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const cubes = input.reduce((acc, item, index) => {
        item.split('').forEach((item2, index2) => {
            acc.set(`${index2}:${index}:0:0`, item2)
        })

        return acc
    }, new Map())

    for (let i = 0; i < 6; i += 1) {
        const temp = new Map(cubes)

        const handleCube = (state, id, skipNeighbors) => {
            const coords = id.split(':')
            const permutations = createPermutations(coords)

            const stats = permutations.reduce((acc, neighborId) => {
                const neighborCoords = neighborId.join(':')
                const neighborState = temp.get(neighborCoords) || '.'

                if (neighborState === '#') {
                    acc.active += 1
                } else {
                    acc.inactive += 1
                }

                if (skipNeighbors !== true && state === '#') {
                    handleCube(neighborState, neighborCoords, true)
                }

                return acc
            }, { active: 0, inactive: 0 })

            if (state === '#') {
                if (stats.active === 2 || stats.active === 3) {
                    cubes.set(id, '#')
                } else {
                    cubes.set(id, '.')
                }
            }

            if (state === '.') {
                if (stats.active === 3) {
                    cubes.set(id, '#')
                } else {
                    cubes.set(id, '.')
                }
            }
        }

        temp.forEach(handleCube)
    }

    console.log([...cubes].reduce((acc, item) => (item[1] === '#' ? acc + 1 : acc), 0))
}

main()
