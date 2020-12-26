const main = async () => {
    const data = '2084668 3704642'
    const [a, b] = data.split(' ').map((item) => +item)

    const calcLoopSize = (target, subject = 7, divider = 20201227) => {
        let i = 0
        let result = 1

        while (result !== target) {
            i += 1
            result *= subject
            result %= divider
        }

        return i
    }

    const calcPrivateKey = (loopSize, subject = 7, divider = 20201227) => {
        let result = 1

        for (let i = 1; i <= loopSize; i += 1) {
            result *= subject
            result %= divider
        }

        return result
    }

    console.log(calcPrivateKey(calcLoopSize(a), b))
    console.log(calcPrivateKey(calcLoopSize(b), a))
}

main()
