require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/5PjP0qgs').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const width = input[0].length
    const height = input.length

    const countTrees = (moveX, moveY) => {
        let x = 0
        let treesCount = 0

        for (let y = 0; y < height; y += moveY) {
            if (input[y][x] === '#') {
                treesCount += 1
            }

            x = (x + moveX) % width
        }

        return treesCount
    }

    console.log(
        countTrees(1, 1)
        * countTrees(3, 1)
        * countTrees(5, 1)
        * countTrees(7, 1)
        * countTrees(1, 2)
    )
}

main()
