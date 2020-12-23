const main = async () => {
    const data = '792845136'
    let input = data.split('').map((item) => +item)
    let current = 0

    for (let i = 1; i <= 100; i += 1) {
        const temp = [...input]
        const picks = temp.splice(current + 1, 3)
        if (picks.length < 3) {
            while (picks.length < 3) {
                picks.push(temp.shift())
            }
        }
        const currentCup = input[current]
        let destination = currentCup - 1
        const lowest = Math.min(...temp)
        const highest = Math.max(...temp)

        while (picks.includes(destination)) {
            destination -= 1

            if (destination < lowest) {
                destination = highest
                break
            }
        }

        if (destination < lowest) {
            destination = highest
        }

        temp.splice(temp.findIndex((item) => item === destination) + 1, 0, ...picks)
        input = temp
        current = (input.findIndex((item) => item === currentCup) + 1) % input.length
    }

    console.log(input.join('').split('1').reverse().join(''))
}

main()
