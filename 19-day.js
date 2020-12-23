require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const ruleMatch = /(?<name>[0-9]{1,}): (?<ranges>.*)/

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/z6DWCm13').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const { rules, messages } = input.reduce((acc, item) => {
        if (item === '') {
            return acc
        }

        const match = item.match(ruleMatch)

        if (match) {
            const { name, ranges } = match.groups

            if (ranges.includes('"')) {
                acc.rootRules[name] = ranges.replace(/"/g, '').split(' ')
                acc.rules[name] = ranges.replace(/"/g, '').split(' ')
            } else {
                acc.rules[name] = ranges.replace(/"/g, '').split(' ')
            }
        } else {
            acc.messages.push(item)
        }

        return acc
    }, { rules: {}, messages: [], rootRules: {} })

    let changed = true
    const limits = {
        8: 0,
        11: 0
    }

    const resolveRule = (rule) => {
        const resolvedRule = rules[rule] || rule

        if (resolvedRule !== rule) {
            changed = true
        }

        if (rule === '8' || rule === '11') {
            limits[rule] += 1
        }

        // because rules 8 and 11 are recursive in part 2
        // i just tried to compile regex of enough length
        // to match all messages, once number of results settled
        // that was final solution
        if (limits[rule] > 11) {
            return resolvedRule.join(' ').split(' | ')[0].split('')
        }

        return resolvedRule
    }

    let flatInput = input.reduce((acc, item) => {
        const match = item.match(ruleMatch)

        if (match) {
            const { name, ranges } = match.groups

            acc[name] = ranges.split(' ')
        }

        return acc
    }, {})

    while (changed) {
        changed = false

        // eslint-disable-next-line no-loop-func
        flatInput = Object.keys(flatInput).reduce((acc, name) => {
            const ranges = flatInput[name]
            let newItem = []

            ranges.forEach((value) => {
                if (value === '#') {
                    return
                }

                if (value === '|' || value === ' ' || value === '(' || value === ')') {
                    newItem.push(value)

                    return
                }

                const newValue = resolveRule(value)

                if (newValue.includes('|')) {
                    newItem = [...newItem, '(', ...newValue, ')']
                } else {
                    newItem = [...newItem, ...newValue]
                }
            })

            acc[name] = newItem

            return acc
        }, {})
    }

    const matchers = Object.keys(flatInput).reduce((acc, name) => {
        const ranges = flatInput[name]

        acc[name] = new RegExp(`^${ranges.join('').replace(/ /g, '')}$`)

        return acc
    }, {})

    console.log(messages.reduce((acc, message) => (message.match(matchers['0']) ? acc + 1 : acc), 0))
}

main()
