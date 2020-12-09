require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')

const instMatch = /^(?<op>acc|jmp|nop) (?<arg>[+-{1}[0-9]{1,})$/

const main = async () => {
    const data = await fetch('https://pastebin.com/raw/eH5gAw3g').then((response) => response.text())
    const input = data.split(/\r?\n/)

    const compile = (acc = 0, callstack = []) => {
        const instance = {
            acc,
            callstack: [...callstack]
        }

        const program = (code, debug, index = 0) => {
            const inst = code[index].match(instMatch).groups
            const { op, arg } = inst
            instance.callstack.push(index)

            const exec = {
                acc: (...args) => {
                    instance.acc += args[0]

                    return [code, index + 1]
                },
                jmp: (...args) => [code, index + args[0]],
                nop: () => [code, index + 1],
            }

            const [nextCode, nextIndex] = exec[op](+arg)

            if (nextIndex === input.length) {
                return instance.acc
            }

            // eslint-disable-next-line max-len
            if (!debug(instance.acc, instance.callstack, inst, code, index, nextCode, nextIndex, nextCode[nextIndex].match(instMatch).groups)) {
                return instance.acc
            }

            return program(nextCode, debug, nextIndex)
        }

        return program
    }

    input.forEach((line, lineIndex) => {
        let inputVariation

        if (line.startsWith('nop')) {
            inputVariation = [...input]
            inputVariation.splice(lineIndex, 1, line.replace('nop', 'jmp'))
        }

        if (line.startsWith('jmp')) {
            inputVariation = [...input]
            inputVariation.splice(lineIndex, 1, line.replace('jmp', 'nop'))
        }

        if (!inputVariation) {
            return
        }

        const program = compile()

        let isLoop = false

        const result = program(
            // eslint-disable-next-line no-unused-vars
            inputVariation, (acc, callstack, inst, code, index, nextCode, nextIndex, nextInst) => {
                if (callstack.includes(nextIndex)) {
                    isLoop = true

                    return false
                }

                return true
            }
        )

        if (!isLoop) {
            console.log(result)
        }
    })
}

main()
