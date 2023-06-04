import { Modal, ModalFooter } from 'reactstrap'
import { useGenerateInputs } from "../functions/forms"
import { useToggle } from '../functions/utility'

export default function SimpleForm(props) {
    const { formName, inputData, submitCallback } = props
    const toggle = useToggle()
    const inputs = useGenerateInputs(inputData)
    
    return (
        <>
            <button onClick={() => toggle.activate()}>{formName}</button>
            <Modal className="modal-form" isOpen={toggle.get()} size='xl' >
                {inputs.inputList}
                <ModalFooter>
                    <button onClick={() => toggle.activate()}>Cancel</button>
                    <button onClick={() => {
                        submitCallback(inputs.values)
                        toggle.activate()
                    }}>Confirm</button>
                </ModalFooter>
            </Modal>
        </>
    )
}