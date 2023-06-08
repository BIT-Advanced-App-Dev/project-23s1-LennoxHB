import { Modal, ModalFooter } from 'reactstrap'
import { useGenerateInputs } from "../functions/forms"
import { useToggle } from '../functions/utility'
import ErrorHandler from './ErrorHandler'
import { useState } from 'react'
import { dbCallWrapper } from '../functions/db'

export default function SimpleForm(props) {
    const { formName, inputData, submitCallback } = props
    const toggle = useToggle()
    const inputs = useGenerateInputs(inputData)
    const [error, setError] = useState('')
    const [spinState, setSpinState] = useState(false)

    return (
        <>
            <button onClick={() => toggle.activate()}>{formName}</button>
            <Modal className="modal-form" isOpen={toggle.get()} size='xl' >
                <h2>{formName}</h2>
                {inputs.inputList}
                <ErrorHandler error={error} spinState={spinState} />
                <ModalFooter>
                    <button onClick={() => toggle.activate()}>Cancel</button>
                    <button onClick={async () => {
                        console.log(inputs.values)
                        const res = await dbCallWrapper(setSpinState, setError, submitCallback, inputs.values)
                        if (res?.error != true) {
                            toggle.activate()
                        }
                    }}>Confirm</button>
                </ModalFooter>
            </Modal>
        </>
    )
}