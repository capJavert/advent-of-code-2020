const main = async () => {
    const data = '792845136'
    const indexMap = new Map()
    let input = data.split('').map((item) => +item)

    const lastNumber = Math.max(...input)
    new Array(1000000 - data.length).fill().forEach((_, index) => {
        input.push(lastNumber + index + 1)
    })

    input = input.map((item, index) => {
        indexMap.set(item, index)

        return {
            value: item
        }
    }).map((item, index, array) => {
        // eslint-disable-next-line no-param-reassign
        item.next = array[(index + 1) % array.length]

        indexMap.set(item.value, item)

        return item
    })

    const sortedAsc = [...input].sort((a, b) => a.value - b.value)
    const sortedDesc = [...sortedAsc].reverse()

    let currentCup = input[0]

    for (let i = 1; i <= 10000000; i += 1) {
        const picks = [
            currentCup.next,
            currentCup.next.next,
            currentCup.next.next.next,
        ]
        let destinationValue = currentCup.value - 1
        const lowest = sortedAsc.find((item) => !picks.some((item2) => item2.value === item.value))
        // eslint-disable-next-line max-len
        const highest = sortedDesc.find((item) => !picks.some((item2) => item2.value === item.value))

        // eslint-disable-next-line no-loop-func
        while (picks.some((item) => item.value === destinationValue)) {
            destinationValue -= 1

            if (destinationValue < lowest.value) {
                destinationValue = highest.value
                break
            }
        }

        if (destinationValue < lowest.value) {
            destinationValue = highest.value
        }

        const destinationCup = indexMap.get(destinationValue)
        currentCup.next = picks[2].next
        picks[2].next = destinationCup.next
        // eslint-disable-next-line prefer-destructuring
        destinationCup.next = picks[0]

        currentCup = currentCup.next
    }

    console.log(indexMap.get(1).next.value * indexMap.get(1).next.next.value)
}

main()
