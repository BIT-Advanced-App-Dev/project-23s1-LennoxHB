import { useParams } from "react-router-dom"
import { announceConnection, useStartGame } from "../functions/game"

export default function Game() {
    const { id } = useParams()
    announceConnection(id)
    useStartGame(id)

    return (
        <>
        </>
    )
}