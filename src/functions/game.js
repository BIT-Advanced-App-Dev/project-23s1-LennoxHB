import { firestore } from "../firebase.js"
import { createDocument } from "./crud.js"
import { doc } from "firebase/firestore"

export const createLobby = async (data) => {
    const ref = doc(firestore, `lobbies`, data.Name)
    await createDocument(ref, data)
}