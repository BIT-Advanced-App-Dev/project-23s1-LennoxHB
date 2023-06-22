import SimpleForm from "./SimpleForm"
import { joinLobby } from "../functions/game"
import { useNavigate } from 'react-router-dom'

// Renders a lobby element users can use to join a lobby.
// Removed password feature because didn't have time to fix issues.
export default function LobbyItem({ data }) {
    const { name, id, password } = data
    const navigate = useNavigate()

    return (
        <div className='lobbyItem'>
            <h2>{name}</h2>
            {password ?
                <SimpleForm
                    formName="Join Game"
                    submitCallback={joinLobby}
                    link={'/lobby/'}
                    inputData={[
                        { field: 'id', type: 'hidden', value: id },
                        { field: 'password', text: 'Password', type: 'password' }
                    ]} />
                :
                <button onClick={() => {
                    joinLobby({id})
                    navigate(`/lobby/${id}`)
                }
                }>Join Game</button>
            }
        </div>
    )
}