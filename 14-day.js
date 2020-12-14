require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const maskMatch = /^mask = (?<mask>[0X1]{36})$/

const memMatch = /^mem\[(?<address>[0-9]{1,})\] = (?<value>[0-9]{1,})$/

const dec2bin = (dec) => {
    return (dec >>> 0).toString(2).padStart(36, '0')
}

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/HZTCADHh').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const result = input.reduce((acc, item) => {
        const mem = item.match(memMatch)

        if (mem) {
            const { address, value } = mem.groups

            const binValue = dec2bin(value)

            acc.mem[address] = parseInt(binValue.split('').map((bit, index) => {
                if (acc.mask[index] !== 'X') {
                    return acc.mask[index]
                }

                return bit
            }).join(''), 2)
        } else {
            const { mask } = item.match(maskMatch).groups

            acc.mask = mask
        }

        return acc
    }, { mem: {}, mask: dec2bin(0) })

    console.log(Object.values(result.mem).reduce((acc, item) => acc + item, 0))
}

main()
