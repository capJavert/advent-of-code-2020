require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/98fY4ZBu').then((response) => response.text())
    const input = data.split(/\r?\n/)
    const allRows = new Array(128).fill(null).map((_, index) => index)
    const allColumns = new Array(8).fill(null).map((_, index) => index)

    const result = input.reduce((acc, item) => {
        const letters = item.split('')
        let rows = [...allRows]
        let columns = [...allColumns]

        letters.slice(0, 7).forEach((letter) => {
            if (letter === 'F') {
                rows = rows.slice(0, rows.length / 2)
            } else {
                rows = rows.slice(rows.length / 2, rows.length)
            }
        })

        letters.slice(7, letters.length).forEach((letter) => {
            if (letter === 'L') {
                columns = columns.slice(0, columns.length / 2)
            } else {
                columns = columns.slice(columns.length / 2, columns.length)
            }
        })

        const seatId = rows[0] * 8 + columns[0]

        if (seatId > acc) {
            return seatId
        }

        return acc
    }, 0)

    console.log(result)
}

main()
