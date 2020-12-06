require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/98fY4ZBu').then((response) => response.text())
    const input = data.split(/\r?\n/)
    const allRows = new Array(128).fill(null).map((_, index) => index)
    const allColumns = new Array(8).fill(null).map((_, index) => index)
    const allSeatIds = allColumns.reduce((acc, column) => {
        allRows.forEach((row) => {
            const seatId = row * 8 + column

            acc[seatId] = { row, column }
        })

        return acc
    }, {})
    console.log(Object.values(allSeatIds).length)

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
        acc[seatId] = seatId

        return acc
    }, {})

    let mySeatId

    allRows.forEach((acc, row) => {
        let rowRender = ''

        allColumns.forEach((column) => {
            const seatId = row * 8 + column

            rowRender += result[seatId] ? '[X]' : '[ ]'
        })

        if ((rowRender.match(/\[ \]/g) || []).length === 1) {
            mySeatId = row * 8 + rowRender.replace(/\[|\]/g, '').indexOf(' ')
        }
        console.log(rowRender)
    })

    console.log(mySeatId)
}

main()
