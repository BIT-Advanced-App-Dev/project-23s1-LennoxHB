import { useEffect, useState } from "react"
import { firestore, auth } from "../firebase.js"
import { setDocument, createDocument, getDocument, getDocuments, useCollectionListener, updateDocument, useDocumentListener, deleteDocument, } from "./crud.js"
import { doc, collection, query, where, limit } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { shuffleArray } from "./utility.js"

export const createLobby = async (data) => {
    const lobby = doc(firestore, `lobbies`, data.id)
    await setDocument(lobby, { ...data, started: false, migrateTrigger: false })
    await joinLobby({ id: data.id, host: true })
}

export const joinLobby = async ({ id, host = false }) => {
    const player = doc(firestore, `lobbies/${id}/players`, auth.currentUser.displayName)
    await setDocument(player, { host: host })
}

export const createGame = async (lobbyId) => {
    const lobbyDoc = doc(firestore, `lobbies`, lobbyId)
    const gameCol = collection(firestore, `games`)
    await updateDocument(lobbyDoc, { started: true })
    const game = await createDocument(gameCol, { started: false, name: lobbyId })
    await migratePlayers(lobbyDoc, lobbyId, game.id)
}

const migratePlayers = async (lobbyDoc, lobbyId, gameId) => {
    const players = await getPlayers(lobbyId)
    players.forEach(async (player) => {
        const playerDoc = doc(firestore, `games/${gameId}/players`, player.id)
        await setDocument(playerDoc, {
            host: player.host,
            connected: false
        })
    })
    await updateDocument(lobbyDoc, { migrateTrigger: true, migrateTo: gameId })
}

export const useMigrateListener = (lobbyId) => {
    const { migrateTrigger, migrateTo } = useDocumentListener(query(doc(firestore, `lobbies`, lobbyId)))
    const navigate = useNavigate()
    useEffect(() => {
        if (migrateTrigger) {
            navigate(`/game/${migrateTo}`)
        }
    }, [migrateTrigger])
}

export const announceConnection = async (gameId) => {
    const player = doc(firestore, `games/${gameId}/players`, auth.currentUser.displayName)
    await setDocument(player, { connected: true })
}

export const useConnectionListenr = (gameId) => {
    const [check, setCheck] = useState(false)
    const [finalCheck, setFinalCheck] = useState(false)
    const players = useCollectionListener(collection(firestore, `games/${gameId}/players`))
    useEffect(() => {
        setCheck(true)
        players.forEach((player) => {
            if (player.connection === false) {
                setCheck(false)
            }
        })
        setFinalCheck(check)
    }, [players])
    return finalCheck
}

export const useStartGame = (gameId) => {
    const checkConnection = useConnectionListenr()
    useEffect(() => {
        if (isHost('games', gameId) && checkConnection) {
            gameLoop(gameId)
        }
    }, [checkConnection])
}

const gameLoop = async (gameId) => {
    await populateDeck(gameId)
    const players = await getDocuments(collection(firestore, `games/${gameId}/players`))
    players.forEach((player) => {
        drawCards(player, gameId, 5)
    })
}

const populateDeck = async (gameId) => {
    const suits = await getDocuments(collection(firestore, `resources/CARDS/houses`))
    const ranks = await getDocuments(collection(firestore, `resources/CARDS/classes`))
    const deck = []
    suits.forEach((suit) => {
        ranks.forEach((rank) => {
            deck.push(
                {
                    text: `${rank.text} of ${suit.text}`,
                    value: rank.value
                }
            )
        })
    })
    const shuffledDeck = shuffleArray(deck)
    shuffledDeck.forEach(async (card) => {
        await createDocument(collection(firestore, `games/${gameId}/deck`), card)
    })
}

const drawCards = async (player, gameId, amount) => {
    for (let idx = amount - 1; idx > 0; idx--) {
        const [card] = await getDocuments(query(collection(firestore, `games/${gameId}/deck`), limit(1)))
        await createDocument(collection(firestore, `games/${gameId}/players/${player.id}/hand`), card)
        await deleteDocument(doc(firestore, `games/${gameId}/deck`, card.id))
    }
}

export const getPlayers = async (id) => {
    return getDocuments(collection(firestore, `lobbies/${id}/players`))
}

export const useGetLobbies = (dbRef) => {
    return useCollectionListener(query(collection(firestore, dbRef), where("started", "==", false)))
}

export const isHost = async (col, id) => {
    const hostDoc = doc(firestore, `${col}/${id}/players/${auth.currentUser.displayName}`)
    return await getDocument(hostDoc).host
}

export const useGetLobbyPlayers = (lobbyId) => {
    return useCollectionListener(collection(firestore, `lobbies/${lobbyId}/players`)).map((player) => player.id)
}