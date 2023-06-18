import { useParams } from "react-router-dom"
import { createGame, isHost, useGetLobbyPlayers, useMigrateListener } from "../functions/game"

export default function Lobby() {
    const { id } = useParams()
    const host = isHost('lobbies', id)
    const players = useGetLobbyPlayers(id)
    useMigrateListener(id)

    return (
        <>            
            {host ?
                <button onClick={async () => {
                    createGame(id)
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