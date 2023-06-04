export const dbCallWrapper = async (setSpin, setError, fn, payload) => {
    try {
        setSpin(true)
        return await fn(payload)        
    } catch (error) {
        setError(error.message)        
    }
    finally{
        setSpin(false)
    }
}