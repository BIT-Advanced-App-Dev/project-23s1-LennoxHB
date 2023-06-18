import { firestore, auth } from "../firebase.js"
import { setDocument, createDocument, getDocument, getDocuments, useOnSnapshot, } from "./crud.js"
import { doc, collection, query, where } from "firebase/firestore"

export const createLobby = async (data) => {
    const lobby = doc(firestore, `lobbies`, data.id)
    await setDocument(lobby, { ...data, started: false })
    await joinLobby({ id: data.id, host: true })
}

export const joinLobby = async ({ id, host = false }) => {
    const player = doc(firestore, `lobbies/${id}/players`, auth.currentUser.displayName)
    await setDocument(player, { host: host })
}

export const useGetLobbies = (dbRef) => {
    return useOnSnapshot(query(collection(firestore, dbRef), where("started", "==", false)))    
}

export const isHost = async (lobbyId) => {
    const hostDoc = doc(firestore, `lobbies/${lobbyId}/players/${auth.currentUser.displayName}`)
    return await getDocument(hostDoc).host
}

export const useGetLobbyPlayers = async (lobbyId) => {
    return useOnSnapshot(collection(firestore, `lobbies/${lobbyId}/players`))    
}