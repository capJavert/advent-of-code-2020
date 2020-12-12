require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/2v8q6apr').then((response) => response.text())
    const input = data.split(/\r?\n/)

    let grid = input.reduce((acc, item, index) => {
        acc[index] = {}

        item.split('').forEach((item2, index2) => {
            acc[index][index2] = item2
        })

        return acc
    }, {})

    const get = (y, x) => {
        if (!grid[y]) {
            return undefined
        }

        return grid[y][x]
    }

    // eslint-disable-next-line no-unused-vars
    const print = () => {
        Object.values(grid).forEach((item) => {
            let line = ''

            Object.values(item).forEach((item2) => {
                line += item2
            })

            console.log(line)
        })
        console.log()
    }

    while (true) {
        let didChange = false

        grid = input.reduce((acc, item, y) => {
            acc[y] = {}

            item.split('').forEach((item2, x) => {
                acc[y][x] = get(y, x)

                if (get(y, x) === 'L') {
                    if ([
                        get(y - 1, x - 1),
                        get(y - 1, x + 0),
                        get(y - 1, x + 1),
                        get(y + 0, x - 1),
                        get(y + 0, x + 1),
                        get(y + 1, x - 1),
                        get(y + 1, x + 0),
                        get(y + 1, x + 1)
                    ].every((seat) => seat === 'L' || typeof seat === 'undefined' || seat === '.')) {
                        acc[y][x] = '#'
                        didChange = true
                    }
                } else if (get(y, x) === '#') {
                    if ([
                        get(y - 1, x - 1),
                        get(y - 1, x + 0),
                        get(y - 1, x + 1),
                        get(y + 0, x - 1),
                        get(y + 0, x + 1),
                        get(y + 1, x - 1),
                        get(y + 1, x + 0),
                        get(y + 1, x + 1)
                    ].reduce((count, seat) => (seat === '#' ? count + 1 : count), 0) >= 4) {
                        acc[y][x] = 'L'
                        didChange = true
                    }
                }
            })

            return acc
        }, {})

        if (!didChange) {
            break
        }
    }

    const result = Object.values(grid).reduce((acc, item) => {
        let count = 0

        Object.values(item).forEach((item2) => {
            if (item2 === '#') {
                count += 1
            }
        })

        return acc + count
    }, 0)

    console.log(result)
}

main()
