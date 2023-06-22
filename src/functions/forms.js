import { useState } from "react"

// Generates the input fields used in the custom form
export const useGenerateInputs = (inputData) => {
    // Get initial value of fields.
    const initialValues = inputData.reduce((obj, item) => {
        return (
            item?.value ?
                {
                    ...obj,
                    [item.field]: item?.value
                }
                :
                {
                    ...obj,
                    [item.field]: ''
                }
        )
    }, {})
    const [values, setValues] = useState(initialValues)
    const inputList = inputData.map((input, index) => {
        return (
            <li key={index} >
                {input.text ?
                    <div>{input.text[0].toUpperCase()}{input.text.slice(1)}</div>
                    :
                    <></>
                }
                <span>
                    <input
                        value={values[input.field]}
                        min={input.min}
                        max={input.max}
                        type={input.type}
                        name={input.field}
                        onChange={(event) => {
                            const { value, name } = event.target
                            setValues(values => ({
                                ...values,
                                [name]: value
                            }))
                        }} />
                    {input.type === 'range' ? <div>{values[input.field]}</div> : <></>}
                </span>
            </li>
        )
    })
    return {
        values,
        inputList
    }
}