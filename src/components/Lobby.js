import { useParams } from "react-router-dom"
import { isHost, useGetLobbyPlayers } from "../functions/game"

export default function Lobby() {
    const params = useParams()
    const host = isHost()
    const players = useGetLobbyPlayers(params.id)
    return (
        <>            
            {host ?
                <button onClick={() => {

                }}>Start Game</button>
                :
                <p>Waiting for game to start...</p>
            }
            <h2>Players:</h2>
            {players.map((player) => {
                return (
                    <li key={player}> {player}</li>
                )
            })}
        </>
    )
}