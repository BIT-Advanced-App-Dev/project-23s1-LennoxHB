import { useShowCards } from "../functions/game"

export default function Hand({ id }) {
    const cards = useShowCards(id)
    return (
        <>
            <div className="playerHand">
                <h1>Your Hand</h1>
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