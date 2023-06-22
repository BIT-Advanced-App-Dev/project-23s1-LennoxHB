import { useState } from "react"

// Toggle state true/false
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

// Randomly shuffle items in an array.
export const shuffleArray = (arr) => {
    for (let idx = arr.length - 1; idx > 0; idx--) {
        const random = Math.floor(Math.random() * idx)
        const prev = arr[idx]
        arr[idx] = arr[random]
        arr[random] = prev
    }
    return arr
}

// Count how often an items occur in an array.
export const countArrayItems = (arr) => {
    return arr.reduce((acc, curr) => {
        acc[curr] = acc[curr] + 1 || 1
        return acc
    }, {})
}

// Check if array has duplicate items or not.
export const hasDuplicates = (arr) =>{
    const filter = arr.filter((item) => item == arr[0])
    if (arr.length != filter.length) {
        return true
    }
    return false
}
