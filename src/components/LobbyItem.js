import SimpleForm from "./SimpleForm"
import { joinLobby } from "../functions/game"
import { useNavigate } from 'react-router-dom'

export default function LobbyItem({ data }) {
    const { id, password } = data
    const navigate = useNavigate()

    return (
        <div className='lobbyItem'>
            <h2>{id}</h2>
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