import { useParams } from "react-router-dom"
import { isHost, useGetLobbyPlayers } from "../functions/game"

export default function Lobby() {
    const params = useParams()
    const host = isHost()
    const players = useGetLobbyPlayers(params)

    return (
        <>
            {host ?
                <button>Start Game</button>
                :
                <p>Waiting for game to start...</p>
            }
        </>
    )
}