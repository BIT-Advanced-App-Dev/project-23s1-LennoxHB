import { useEffect, useState } from "react"
import { firestore, auth } from "../firebase.js"
import { setDocument, createDocument, getDocument, getDocuments, useCollectionListener, updateDocument, useDocumentListener, deleteDocument, } from "./crud.js"
import { doc, collection, query, where, limit } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { countArrayItems, hasDuplicates, shuffleArray } from "./utility.js"
import { useRenderRead } from "./db.js"

// Create a lobby and add the creator to the lobby.
export const createLobby = async (data) => {
    const lobby = await createDocument(collection(firestore, 'lobbies'), { ...data, started: false, migrateTrigger: false })
    await joinLobby({ id: lobby, host: true })
    return lobby
}

// Adds a player to given lobby.
export const joinLobby = async ({ id, host = false }) => {
    const player = doc(firestore, `lobbies/${id}/players`, auth.currentUser.displayName)
    await setDocument(player, { host: host })
}

// Remove player from lobby.
export const leaveLobby = async (id) => {
    await deleteDocument(doc(firestore, `lobbies/${id}/players`, auth.currentUser.displayName))
}

// Creates a game from lobby.
export const createGame = async (lobbyId) => {
    const lobbyDoc = doc(firestore, `lobbies`, lobbyId)
    const gameCol = collection(firestore, `games`)
    await updateDocument(lobbyDoc, { started: true })
    const game = await createDocument(gameCol, { phase: 'preparing', started: false })
    await migratePlayers(lobbyDoc, lobbyId, game)
}

// Add players to the game
const migratePlayers = async (lobbyDoc, lobbyId, gameId) => {
    const players = await getPlayers({ col: 'lobbies', id: lobbyId })
    players.forEach(async (player) => {
        const playerDoc = doc(firestore, `games/${gameId}/players`, player.id)
        await setDocument(playerDoc, {
            host: player.host,
            connected: false
        })
    })
    // Trigger a migration from lobby to game once all players added.
    await updateDocument(lobbyDoc, { migrateTrigger: true, migrateTo: gameId })
}

// Navigate players to the game instance
export const useMigrateListener = (lobbyId) => {
    const { migrateTrigger, migrateTo } = useDocumentListener(query(doc(firestore, `lobbies`, lobbyId)))
    const navigate = useNavigate()
    useEffect(() => {
        if (migrateTrigger) {
            navigate(`/game/${migrateTo}`)
        }
    }, [migrateTrigger])
}

// Announce that the player has connected to the game.
export const announceConnection = async (gameId) => {
    const player = doc(firestore, `games/${gameId}/players`, auth.currentUser.displayName)
    await updateDocument(player, { connected: true })
}

// Checks that all players are connected to the game.
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

// Starts game if conditions are met.
export const useStartGame = (gameId) => {
    const checkConnection = useConnectionListenr(gameId)
    const host = useRenderRead(isHost, { col: 'games', id: gameId })
    useEffect(() => {
        if (host === true && checkConnection) {
            gameLoop(gameId)
        }
    }, [checkConnection, host])
}

// Main game loop.
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

// Returns infomation about the game.
export const useGetGameState = (gameId) => {
    return useDocumentListener(doc(firestore, `games/${gameId}`))
}

// Get a shuffled deck of cards for the game.
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

// Draw a hand of cards for a player.
const drawCards = async (player, gameId, amount) => {
    for (let idx = amount; idx > 0; idx--) {
        const [card] = await getDocuments(query(collection(firestore, `games/${gameId}/deck`), limit(1)))
        await createDocument(collection(firestore, `games/${gameId}/players/${player.id}/hand`), card)
        await deleteDocument(doc(firestore, `games/${gameId}/deck`, card.id))
    }
}

// Show the player's cards
export const useShowCards = (player, gameId) => {
    return useCollectionListener(collection(firestore, `games/${gameId}/players/${player.id}/hand`))
}

// Gets a list of players
// Was going to use 'you' to render certain components on frontend (did not get that far)
export const getPlayers = async ({ col, id }) => {
    const players = (await getDocuments(collection(firestore, `${col}/${id}/players`))).map((player) => {
        if (player.id == auth.currentUser.displayName) {
            return { ...player, you: true }
        }
        else {
            return { ...player }
        }
    })
    return players
}

// Gets a list of lobbies
export const useGetLobbies = (dbRef) => {
    return useCollectionListener(query(collection(firestore, dbRef), where("started", "==", false)))
}

// Checks if the user is the host
export const isHost = async ({ col, id }) => {
    const hostDoc = doc(firestore, `${col}/${id}/players/${auth.currentUser.displayName}`)
    const host = await getDocument(hostDoc)
    return host.host
}

// Listens to who is in the lobby
export const useGetPlayers = (lobbyId) => {
    return useCollectionListener(collection(firestore, `lobbies/${lobbyId}/players`)).map((player) => player.id)
}

// Checks that player hand ranks meet conditions for certain score.
const checkRanks = (conditionRanks, handRanks) => {
    let finalCheck = true
    const used = []
    // Count how often a rank occurs
    const countRanks = countArrayItems(handRanks)
    conditionRanks.forEach((conditionRanks) => {
        let check = false
        for (const [cardRank, cardOccurance] of Object.entries(countRanks)) {
            // Check if card is required rank or if condition is any
            if (((conditionRanks.value == cardRank) || (conditionRanks.value == 'any')
                // Check if card needs to be consecutive, and if card before it was one less.
                || ((conditionRanks.value == 'consecutive') && ((used.length == 0) || (cardRank == (Number(used[used.length - 1]) + 1)))))
                // Check how often this rank must occur (for pairs)
                && (conditionRanks.occurance == cardOccurance)
                // Check that condition is already met or card has been used for a previous condition.
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

// Return the highest score out of all players.
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

// Check what score given card ranks/suits get based on a number of conditions.
const calculateScore = (ranks, suits, conditions) => {
    const candidates = []
    // Find highcard value
    const highCard = ranks.reduce((prev, curr) => {
        return curr > prev ? curr : prev
    }, 0)
    // Check if hand meets conditions for special hands (pair, flush, etc)
    conditions.forEach((condition) => {
        if ((!hasDuplicates(suits) === condition.sameSuit) && (checkRanks(condition.ranks, ranks))) {
            candidates.push({ text: condition.text, points: condition.points + highCard })
        }
    })
    // If hand does meet at least one condition, reduce down to the one that has highest value.
    if (candidates.length > 0) {
        return candidates.reduce((prev, curr) => {
            return curr.points > prev.points ? curr : prev
        }, { points: 0 })
    }
    // Else return high card score.
    else {
        return { text: 'High Card', points: highCard }
    }
}

// export const useGetScores