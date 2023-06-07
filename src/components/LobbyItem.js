import SimpleForm from "./SimpleForm"
import { joinLobby } from "../functions/game"

export default function LobbyItem({ data }) {
    const { name, key, password } = data

    return (
        <li className='lobbyItem' key={key}>
            <h2>{name}</h2>
            {password ?
                <SimpleForm
                    formName="Join Game"
                    submitCallback={joinLobby}
                    inputData={[
                        { field: 'name', type: 'hidden', value: name },
                        { field: 'password', text: 'Password', type: 'password' }
                    ]} />
                :
                <button onClick={() => joinLobby(name)}>Join Game</button>
            }
        </li>
    )
}