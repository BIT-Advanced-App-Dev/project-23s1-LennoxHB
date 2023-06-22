import { useParams } from "react-router-dom"
import { announceConnection, getPlayers, useGetGameState, useGetPlayers, useStartGame } from "../functions/game"
import Hand from "./Hand"
import { useRenderRead } from "../functions/db"
//Renders the player's hand and shows who won based on game state
export default function Game() {
    const { id } = useParams()
    const players = useRenderRead(getPlayers, { col: 'games', id: id }, [])
    const gameState = useGetGameState(id)    
    announceConnection(id)
    useStartGame(players, id)


    return (
        <>
            <div>
                {players.map((player) => {
                    if (player.you) {
                        return (
                            <Hand key={player.id} player={player} gameId={id} />
                        )
                    }
                })}
            </div>
            {gameState.phase == 'concluded' ? <h1>{gameState.winner.player} won with {gameState.winner.text}, points: {gameState.winner.points}</h1> : <></>}
        </>
    )
}