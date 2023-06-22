import { useEffect, useState } from "react"
import { firestore, auth } from "../firebase.js"
import { setDocument, createDocument, getDocument, getDocuments, useCollectionListener, updateDocument, useDocumentListener, deleteDocument, } from "./crud.js"
import { doc, collection, query, where, limit } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { countArrayItems, hasDuplicates, shuffleArray } from "./utility.js"
import { useRenderRead } from "./db.js"

export const createLobby = async (data) => {
    const lobby = await createDocument(collection(firestore, 'lobbies'), { ...data, started: false, migrateTrigger: false })
    await joinLobby({ id: lobby, host: true })
    return lobby
}

export const joinLobby = async ({ id, host = false }) => {
    const player = doc(firestore, `lobbies/${id}/players`, auth.currentUser.displayName)
    await setDocument(player, { host: host })
}

export const createGame = async (lobbyId) => {
    const lobbyDoc = doc(firestore, `lobbies`, lobbyId)
    const gameCol = collection(firestore, `games`)
    await updateDocument(lobbyDoc, { started: true })
    const game = await createDocument(gameCol, { phase: 'preparing', started: false })
    await migratePlayers(lobbyDoc, lobbyId, game)
}

const migratePlayers = async (lobbyDoc, lobbyId, gameId) => {
    const players = await getPlayers({ col: 'lobbies', id: lobbyId })    
    console.log(players)
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
    await updateDocument(player, { connected: true })
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

export const useStartGame = (players, gameId) => {
    const checkConnection = useConnectionListenr(gameId)
    const host = useRenderRead(isHost, { col: 'games', id: gameId })
    useEffect(() => {
        if (host === true && checkConnection) {
            gameLoop(gameId)
        }
    }, [checkConnection, host])
}

const gameLoop = async (gameId) => {
    const game = await getDocument(doc(firestore, `games/${gameId}`))
    if (game.started === false && game.phase != 'concluded') {
        await updateDocument(doc(firestore, `games/${gameId}`), { started: true })
        await populateDeck(gameId)
        const players = await getDocuments(collection(firestore, `games/${gameId}/players`))
        for (const player of players) {
            await drawCards(player, gameId, 5)
        }
        const hightScore = await calculateHighScore(players, gameId)
        await updateDocument(doc(firestore, `games/${gameId}`), { phase: 'concluded', started: false, winner: hightScore })
    }
}
export const useGetGameState = (gameId) => {
    return useDocumentListener(doc(firestore, `games/${gameId}`))
}

const populateDeck = async (gameId) => {
    const suits = await getDocuments(collection(firestore, `resources/CARDS/houses`))
    const ranks = await getDocuments(collection(firestore, `resources/CARDS/classes`))
    const deck = []
    suits.forEach((suit) => {
        ranks.forEach((rank) => {
            deck.push(
                {
                    img: `${rank.id}${suit.id}`,
                    text: `${rank.text} of ${suit.text}`,
                    rank: rank.value,
                    suit: suit.value
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
    for (let idx = amount; idx > 0; idx--) {
        const [card] = await getDocuments(query(collection(firestore, `games/${gameId}/deck`), limit(1)))
        await createDocument(collection(firestore, `games/${gameId}/players/${player.id}/hand`), card)
        await deleteDocument(doc(firestore, `games/${gameId}/deck`, card.id))
    }
}

export const useShowCards = (player, gameId) => {
    return useCollectionListener(collection(firestore, `games/${gameId}/players/${player.id}/hand`))
}

export const getPlayers = async ({ col, id }) => {
    const temp = (await getDocuments(collection(firestore, `${col}/${id}/players`))).map((player) => {
        if (player.id == auth.currentUser.displayName) {
            return { ...player, you: true }
        }
        else {
            return { ...player }
        }
    })
    return temp
}

export const useGetLobbies = (dbRef) => {
    return useCollectionListener(query(collection(firestore, dbRef), where("started", "==", false)))
}

export const isHost = async ({ col, id }) => {
    const hostDoc = doc(firestore, `${col}/${id}/players/${auth.currentUser.displayName}`)
    const host = await getDocument(hostDoc)
    return host.host
}

export const useGetPlayers = (lobbyId) => {
    return useCollectionListener(collection(firestore, `lobbies/${lobbyId}/players`)).map((player) => player.id)
}

const checkRanks = (conditionRanks, handRanks) => {
    let finalCheck = true
    const used = []
    const countRanks = countArrayItems(handRanks)
    conditionRanks.forEach((conditionRanks) => {
        let check = false
        for (const [cardRank, cardOccurance] of Object.entries(countRanks)) {
            if (((conditionRanks.value == cardRank) || (conditionRanks.value == 'any')
                || ((conditionRanks.value == 'consecutive') && ((used.length == 0) || (cardRank == (Number(used[used.length - 1]) + 1)))))
                && (conditionRanks.occurance == cardOccurance)
                && ((!check) && (!used.includes(cardRank)))) {
                check = true
                used.push(cardRank)
            }
        }
        if (finalCheck && !check) {
            finalCheck = false
        }
    })
    return finalCheck
}

const calculateHighScore = async (players, gameId) => {
    const conditions = await getDocuments(collection(firestore, 'resources/CARDS/conditions'))
    let results = []
    for (const player of players) {
        const hand = await getDocuments(collection(firestore, `games/${gameId}/players/${player.id}/hand`))
        const ranks = hand.map((card) => card.rank)
        const suits = hand.map((card) => card.suit)
        results.push({ ...calculateScore(ranks, suits, conditions), player: player.id }) 
    }
    return results.reduce((prev, curr) => {
        return curr.points > prev.points ? curr : prev
    }, { points: 0 })
}
const calculateScore = (ranks, suits, conditions) => {
    const candidates = []
    const highCard = ranks.reduce((prev, curr) => {
        return curr > prev ? curr : prev
    }, 0)
    conditions.forEach((condition) => {
        if ((!hasDuplicates(suits) === condition.sameSuit) && (checkRanks(condition.ranks, ranks))) {
            candidates.push({ text: condition.text, points: condition.points + highCard })
        }
    })
    if (candidates.length > 0) {
        return candidates.reduce((prev, curr) => {
            return curr.points > prev.points ? curr : prev
        }, { points: 0 })
    }
    else {
        return { text: 'High Card', points: highCard }
    }
}

// export const useGetScores