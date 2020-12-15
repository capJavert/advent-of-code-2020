const main = async () => {
    const data = '8,11,0,19,1,2'
    const input = data.split(',').map((item) => +item)

    const numbers = input.reduce((acc, item, index) => {
        acc[item] = [index + 1]

        return acc
    }, {})
    let index = input.length + 1
    let lastNumber = input[input.length - 1]

    while (index <= 2020) {
        let newNumber

        if (numbers[lastNumber].length === 1) {
            newNumber = 0
            numbers[newNumber] = numbers[newNumber] ? [index, ...numbers[newNumber]] : [index]
        } else {
            const [a, b] = numbers[lastNumber]
            newNumber = a - b
            numbers[newNumber] = numbers[newNumber] ? [index, ...numbers[newNumber]] : [index]
        }

        lastNumber = newNumber
        index += 1
    }

    console.log(lastNumber, index)
}

main()
