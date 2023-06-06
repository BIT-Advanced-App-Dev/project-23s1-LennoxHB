import { useState } from "react"

export const handleSubmit = (fn, data) => {
    fn(data)
}

export const useGenerateInputs = (inputData) => {
    const initialValues = inputData.reduce((obj, item) => {
        return {
            ...obj,
            [item.field]: null
        }
    }, {})
    const [values, setValues] = useState(initialValues)
    const inputList = inputData.map((input, index) => {
        return (
            <li key={index} >
                <div>{input.text[0].toUpperCase()}{input.text.slice(1)}</div>
                <input
                    type={input.type}
                    name={input.field}
                    onChange={(event) => {
                        const { value, name } = event.target
                        setValues(values => ({
                            ...values,
                            [name]: value
                        }))
                    }} />
            </li>
        )
    })
    return {
        values,
        inputList
    }
}