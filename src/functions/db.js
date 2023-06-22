import { useEffect, useState } from "react"

// Wrap calls to database to handle error handling on frontend.
export const dbCallWrapper = async (setSpin, setError, fn, payload) => {
    try {
        setSpin(true)
        return await fn(payload)
    } catch (error) {
        setError(error.message)
        return { error: true }
    }
    finally {
        setSpin(false)
    }
}

// Tries to get data then rerenders component with data
export const useRenderRead = (fn, payload, initial = false) => {
    const [data, setData] = useState(initial)
    useEffect(() => {
        const setRead = async () => {
            setData(await fn(payload))
        }
        setRead()
    }, [])
    return data
}