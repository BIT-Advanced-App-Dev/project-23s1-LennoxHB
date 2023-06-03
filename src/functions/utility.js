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