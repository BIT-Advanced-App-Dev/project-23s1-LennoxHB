import { useState } from "react"

export const useToggle = () => {
    const [bool, setBool] = useState(false)
    return {
        get () {
            return bool
        },
        activate () {
            setBool(!bool)
        }
    }
}

export const shuffleArray = (arr) => {
    for (idx = arr.length - 1; idx > 0; idx--) {
        random = Math.floor(Math.random() * idx)
        prev = arr[idx]
        arr[idx] = arr[random]
        arr[random] = prev
    }
    return arr
}

export const countArrayItems = (arr) => {
    return arr.reduce((acc, curr) => {
        acc[curr] = acc[curr] + 1 || 1
        return acc
    }, {})
}