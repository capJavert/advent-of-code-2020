require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const ruleMatch = /(?<field>[a-z]{1,}): (?<range1>[0-9]{1,}-[0-9]{1,}) or (?<range2>[0-9]{1,}-[0-9]{1,})/

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/03MZuL6L').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const { fields, tickets } = input.reduce((acc, item) => {
        if (item !== '') {
            const nextSection = {
                'your ticket:': 'tickets',
                'nearby tickets:': 'tickets'
            }[item]

            if (nextSection) {
                acc.section = nextSection
            } else {
                const parse = ({
                    rules: () => {
                        const { field, ...rest } = item.match(ruleMatch).groups
                        const ranges = new Map()

                        Object.values(rest).forEach((range) => {
                            const [a, b] = range.split('-')

                            for (let i = +a; i <= +b; i += 1) {
                                ranges.set(i, i)
                            }
                        })

                        acc.fields[field] = ranges
                    },
                    tickets: () => {
                        acc.tickets.push(item.split(',').reduce((items, i) => {
                            items.push(+i)

                            return items
                        }, []))
                    }
                })[acc.section]

                parse()
            }
        }

        return acc
    }, { fields: {}, tickets: [], section: 'rules' })

    const [, ...otherTickets] = tickets

    const result = otherTickets.reduce((acc, ticket) => {
        ticket.forEach((item) => {
            if (Object.values(fields).every((field) => {
                return !field.has(item)
            })) {
                acc.push(item)
            }
        })

        return acc
    }, [])

    console.log(result.reduce((acc, item) => acc + item, 0))
}

main()
