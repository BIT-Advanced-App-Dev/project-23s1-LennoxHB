import { useNavigate, useParams } from "react-router-dom"
import { createGame, isHost, leaveLobby, useGetLobbyPlayers, useGetPlayers, useMigrateListener } from "../functions/game"
import { useRenderRead } from "../functions/db"

// Pregame lobby, shows who is waiting for the game to start, renders option for host to start the game.
export default function Lobby() {
    const { id } = useParams()
    const host = useRenderRead(isHost, { col: 'lobbies', id: id })
    const players = useGetPlayers(id)
    useMigrateListener(id)
    const navigate = useNavigate()

    return (
        <>
            <button onClick={() => {
                leaveLobby(id)
                navigate('/')
            }}>
                Leave
            </button>
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