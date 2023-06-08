import { firestore, auth } from "../firebase.js"
import { createDocument } from "./crud.js"
import { doc } from "firebase/firestore"

export const createLobby = async (data) => {
    const lobby = doc(firestore, `lobbies`, data.name)
    await createDocument(lobby, { ...data, started: false })
    await joinLobby({ name: data.name, host: true })
}

export const joinLobby = async ({ name, host = false }) => {
    const player = doc(firestore, `lobbies/${name}/players`, auth.currentUser.displayName)
    await createDocument(player, { displayName: auth.currentUser.displayName, host: host })
}