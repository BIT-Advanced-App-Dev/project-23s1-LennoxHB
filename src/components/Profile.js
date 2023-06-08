import { logout } from "../functions/auth"

export default function Profile({ name }) {
    return (
        <div className="profile">
            <h3>{name}</h3>
            <button onClick={() => logout()}>Sign Out</button>
        </div>
    )
}