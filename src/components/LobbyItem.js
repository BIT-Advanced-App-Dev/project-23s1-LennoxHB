export default function LobbyItem({ data }) {
    const { name, key } = data

    return (
        <li className='lobbyItem' key={key}>
            <h2>{name}</h2>
            <button>Join Game</button>
        </li>
    )
}