require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const ruleMatch = /(?<field>[a-z ]{1,}): (?<range1>[0-9]{1,}-[0-9]{1,}) or (?<range2>[0-9]{1,}-[0-9]{1,})/

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

    const [myTicket, ...otherTickets] = tickets

    const validTickets = [myTicket, ...otherTickets.filter((ticket) => {
        return !ticket.some((item) => {
            return Object.values(fields).every((field) => {
                return !field.has(item)
            })
        })
    })]

    const fieldsForRows = {}
    const orderedFields = {}

    for (let i = 0; i < myTicket.length; i += 1) {
        let fieldNames = Object.keys(fields)

        for (let j = 0; j < validTickets.length; j += 1) {
            fieldNames = fieldNames.filter((name) => {
                const range = fields[name]

                return range.has(validTickets[j][i])
            })

            if (fieldNames.length === 1) {
                const nameForRow = fieldNames[0]
                orderedFields[nameForRow] = +i
                delete fields[nameForRow]

                break
            }
        }

        fieldsForRows[i] = fieldNames
    }

    while (Object.keys(orderedFields).length !== myTicket.length) {
        Object.keys(fieldsForRows).forEach((row) => {
            fieldsForRows[row] = fieldsForRows[row].filter((field) => !orderedFields[field])

            if (fieldsForRows[row].length === 1) {
                const nameForRow = fieldsForRows[row][0]
                orderedFields[nameForRow] = row
                delete fieldsForRows[row]
            }
        })
    }

    const translatedTicket = myTicket.reduce((acc, item, index) => {
        const field = Object.keys(orderedFields).find((name) => +orderedFields[name] === index)

        acc[field] = item

        return acc
    }, {})

    console.log(Object.keys(translatedTicket).reduce((acc, name) => {
        if (name.startsWith('departure')) {
            return acc * +translatedTicket[name]
        }

        return acc
    }, 1))
}

main()
