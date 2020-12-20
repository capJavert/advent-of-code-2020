require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/B0VMkzrX').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const invertMath = (expression) => {
        const { result } = expression.reduce((acc, item) => {
            if (item === '(') {
                acc.groups.push([])
                acc.group = acc.groups[acc.groups.length - 1]

                return acc
            }

            if (item === ')') {
                const lastGroup = acc.groups.pop()
                acc.group = acc.groups[acc.groups.length - 1]

                if (acc.group) {
                    acc.group.push(lastGroup)
                } else {
                    acc.result.push(lastGroup)
                }

                return acc
            }

            if (acc.group) {
                acc.group.push(item)

                return acc
            }

            acc.result.push(item)

            return acc
        }, {
            result: [],
            operator: undefined,
            groups: [],
            group: undefined
        })

        const inverted = []

        const deepInvert = (tokens, depth = 0) => {
            if (depth > 0) {
                inverted.push('(')
            }

            tokens.forEach((item, index) => {
                if (tokens[index - 1] === '+') {
                    inverted.splice(inverted.length - 2, 0, '(')
                    if (Array.isArray(item)) {
                        deepInvert(item, depth + 1)
                    } else {
                        inverted.push(item)
                    }
                    inverted.push(')')
                } else if (Array.isArray(item)) {
                    deepInvert(item, depth + 1)
                } else {
                    inverted.push(item)
                }
            })

            if (depth > 0) {
                inverted.push(')')
            }
        }

        deepInvert(result)

        return inverted.join('').replace(/\(\)/g, '').split('')
    }

    const evaluate = (expression) => {
        let initialValue

        if (typeof expression[0] !== 'number') {
            initialValue = 0
        } else {
            initialValue = expression.shift()
        }

        return expression.reduce((acc, item) => {
            if (item === '(') {
                acc.groups.push([])
                acc.group = acc.groups[acc.groups.length - 1]

                return acc
            }

            if (item === ')') {
                const lastGroup = acc.groups.pop()
                acc.group = acc.groups[acc.groups.length - 1]

                if (acc.group) {
                    acc.group.push(evaluate(lastGroup).result)
                } else {
                    acc.result = eval(`${acc.result}${acc.operator || '+'}${evaluate(lastGroup).result}`)
                }

                return acc
            }

            if (acc.group) {
                acc.group.push(item)

                return acc
            }

            if (item === '+' || item === '*') {
                acc.operator = item

                return acc
            }

            acc.result = eval(`${acc.result}${acc.operator || '+'}${item}`)

            return acc
        }, {
            result: initialValue,
            operator: undefined,
            groups: [],
            group: undefined
        })
    }

    const result = input.reduce((acc, line) => {
        const expression = line.replace(/ /g, '').split('').map((item) => (Number.isNaN(+item) ? item : +item))

        return acc + evaluate(invertMath(expression)).result
    }, 0)

    console.log(result)
}

main()
