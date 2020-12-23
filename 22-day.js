require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const play = (deck1, deck2) => {
    const memo = new Set()
    let winner

    while (deck1.length > 0 && deck2.length > 0) {
        if (memo.has(`${deck1.toString()}${deck2.toString()}`)) {
            winner = 1
            break
        } else {
            memo.add(`${deck1.toString()}${deck2.toString()}`)
        }

        const draw1 = deck1.shift()
        const draw2 = deck2.shift()

        if (deck1.length >= draw1 && deck2.length >= draw2) {
            const subWinner = play(
                deck1.slice(0, draw1),
                deck2.slice(0, draw2)
            )

            if (subWinner === 1) {
                deck1.push(draw1)
                deck1.push(draw2)
            } else {
                deck2.push(draw2)
                deck2.push(draw1)
            }
        } else if (draw1 > draw2) {
            deck1.push(draw1)
            deck1.push(draw2)
        } else {
            deck2.push(draw2)
            deck2.push(draw1)
        }
    }

    if (winner === 1 || deck1.length > 0) {
        return 1
    }

    return 2
}

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

    const winner = play(deck1, deck2)

    if (deck1.length > 0 || winner === 1) {
        console.log(deck1.reverse().reduce((acc, item, index) => acc + item * (index + 1), 0))
    } else {
        console.log(deck2.reverse().reduce((acc, item, index) => acc + item * (index + 1), 0))
    }
}

main()
