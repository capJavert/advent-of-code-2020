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

            const binAddress = dec2bin(address)

            const maskedAddress = binAddress.split('').map((bit, index) => {
                if (acc.mask[index] !== '0') {
                    return acc.mask[index]
                }

                return bit
            })

            const floatingBits = maskedAddress.reduce((acc2, bit, index) => (bit === 'X' ? [...acc2, index] : acc2), [])

            // shamelessly took from http://zacg.github.io/blog/2013/08/02/binary-combinations-in-javascript/
            for (let y = 0; y < 2 ** floatingBits.length; y += 1) {
                const floatingAddress = [...maskedAddress]

                for (let x = 0; x < floatingBits.length; x += 1) {
                    // shift bit and and it with 1
                    if ((y >> x) & 1) {
                        floatingAddress[floatingBits[x]] = 1
                    } else {
                        floatingAddress[floatingBits[x]] = 0
                    }
                }

                acc.mem[parseInt(floatingAddress.join(''), 2)] = +value
            }
        } else {
            const { mask } = item.match(maskMatch).groups

            acc.mask = mask
        }

        return acc
    }, { mem: {}, mask: dec2bin(0) })

    console.log(Object.values(result.mem).reduce((acc, item) => acc + item, 0))
}

main()
