import { useState } from "react"

export const handleSubmit = (fn, data) => {
    fn(data)
}

export const useGenerateInputs = (inputData) => {
    const initialValues = inputData.reduce((obj, item) => {
        return {
            ...obj,
            [item.name]: null
        }
    }, {})
    const [values, setValues] = useState(initialValues)
    const inputList = inputData.map((input, index) => {
        return (
            <li key={index} >
                <div>{input.name} {input.optional ? '(optional)' : ''}</div>
                <input
                    type={input.type}
                    placeholder={input.name}
                    name={input.name}
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