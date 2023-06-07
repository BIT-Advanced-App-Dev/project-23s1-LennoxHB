import { Spinner } from "reactstrap"

export default function ErrorHandler({ error, spinState }) {

    return (
        <span className="errorHandler">
            {spinState ?
                <Spinner />
                :
                <>
                </>
            }
            <div className="message">
                {error}
            </div>
        </span>
    )
}