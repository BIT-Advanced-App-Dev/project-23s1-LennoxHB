import { useEffect, useState } from "react"

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