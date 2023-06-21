import { useParams } from "react-router-dom"
import { createGame, isHost, useGetLobbyPlayers, useMigrateListener } from "../functions/game"
import { useRenderRead } from "../functions/db"

export default function Lobby() {
    const { id } = useParams()
    const host = useRenderRead(isHost, {col: 'lobbies', id: id})
    const players = useGetLobbyPlayers(id)
    useMigrateListener(id)

    return (
        <>            
            {host == true ?
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