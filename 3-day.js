require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/5PjP0qgs').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const width = input[0].length
    const height = input.length
    let x = 0
    let treesCount = 0

    for (let y = 0; y < height; y += 1) {
        if (input[y][x] === '#') {
            treesCount += 1
        }

        x = (x + 3) % width
    }

    console.log(treesCount)
}

main()
