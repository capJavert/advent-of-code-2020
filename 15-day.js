const main = async () => {
    const data = '8,11,0,19,1,2'
    const input = data.split(',').map((item) => +item)

    const numbers = input.reduce((acc, item, index) => {
        if (index < input.length - 1) {
            acc.set(item, index)
        }

        return acc
    }, new Map())

    let index = input.length
    let lastNumber = input[input.length - 1]

    while (index < 30000000) {
        let newNumber = 0

        if (numbers.has(lastNumber)) {
            newNumber = (index - 1) - numbers.get(lastNumber)
        }

        numbers.set(lastNumber, index - 1)

        lastNumber = newNumber
        index += 1
    }

    console.log(lastNumber)
}

main()
