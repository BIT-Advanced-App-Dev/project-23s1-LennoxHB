import { firestore, auth } from "../firebase.js"
import { createDocument, getDocument, getDocuments, } from "./crud.js"
import { doc, collection } from "firebase/firestore"

export const createLobby = async ({ id }) => {
    const lobby = doc(firestore, `lobbies`, id)
    await createDocument(lobby, { started: false })
    await joinLobby({ id: id, host: true })
}

export const joinLobby = async ({ id, host = false }) => {
    const player = doc(firestore, `lobbies/${id}/players`, auth.currentUser.displayName)
    await createDocument(player, { host: host })
}