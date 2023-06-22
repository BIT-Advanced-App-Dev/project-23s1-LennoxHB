import { useShowCards } from "../functions/game"

export default function Hand({ player, gameId }) {
    const cards = useShowCards(player, gameId)
    return (
        <>
            <div className="playerHand">
                {player.you ? <h1>Your Hand</h1> : <h1>{`${player.id}'s Hand`}</h1>}
                <div className="cards">
                    {cards.map((item) => {
                        return (
                            <img key={item.id} src={require(`../resources/${item.img}.jpg`)}></img>
                        )
                    })}
                </div>
            </div>
        </>
    )
} 