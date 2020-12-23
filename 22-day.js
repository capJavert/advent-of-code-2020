require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const data1 = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/FW6fpQ70').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const { deck1, deck2 } = input.reduce((acc, item) => {
        if (item === '') {
            return acc
        }

        if (item.startsWith('Player ')) {
            acc.current = +item.split('Player ')[1].replace(':', '')
            acc[`deck${acc.current}`] = []

            return acc
        }

        acc[`deck${acc.current}`].push(+item)

        return acc
    }, { crrent: undefined })

    while (deck1.length > 0 && deck2.length > 0) {
        const draw1 = deck1.shift()
        const draw2 = deck2.shift()

        if (draw1 > draw2) {
            deck1.push(draw1)
            deck1.push(draw2)
        } else {
            deck2.push(draw2)
            deck2.push(draw1)
        }
    }

    if (deck1.length > 0) {
        console.log(deck1.reverse().reduce((acc, item, index) => acc + item * (index + 1), 0))
    } else {
        console.log(deck2.reverse().reduce((acc, item, index) => acc + item * (index + 1), 0))
    }
}

main()
