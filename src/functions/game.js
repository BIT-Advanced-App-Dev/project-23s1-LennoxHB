import { firestore, auth } from "../firebase.js"
import { createDocument } from "./crud.js"
import { doc } from "firebase/firestore"

export const createLobby = async (data) => {
    const lobby = doc(firestore, `lobbies`, data.name)
    await createDocument(lobby, data)
    await joinLobby({ name: data.name })
}

export const joinLobby = async ({ name }) => {
    const player = doc(firestore, `lobbies/${name}/players`, auth.currentUser.displayName)
    await createDocument(player, { displayName: auth.currentUser.displayName })
}