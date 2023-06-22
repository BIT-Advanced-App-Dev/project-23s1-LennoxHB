import { Spinner } from "reactstrap"

// Shows error or spinner based on props.
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