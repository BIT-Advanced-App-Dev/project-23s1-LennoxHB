import { addDoc, setDoc, deleteDoc, getDoc, getDocs, updateDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from "react"

export const getDocuments = async (query) => {
    const snapshot = await getDocs(query)
    return snapshot.docs.map((doc) => {
        return (
            { ...doc.data(), id: doc.id }
        )
    })
}

export const getDocument = async (query) => {
    const doc = await getDoc(query)
    return { ...doc.data(), id: doc.id }
}

export const setDocument = async (ref, data) => {
    return await setDoc(ref, data)
}

export const createDocument = async (ref, data) => {
    const create = await addDoc(ref, data)
    return create.id
}

export const deleteDocument = async (doc) => {
    await deleteDoc(doc)
}

export const updateDocument = async (doc, data) => {
    await updateDoc(doc, data)
}

export const useDocumentListener = (query) => {
    const [data, setData] = useState([])
    useEffect(() => {
        const unsub = onSnapshot(query, (doc) => {
            setData({ ...doc.data(), id: doc.id })
        })
        return () => unsub()
    }, [])
    return data
}

export const useCollectionListener = (query) => {
    const [data, setData] = useState([])
    useEffect(() => {
        const unsub = onSnapshot(query, (shot) => {
            setData(shot.docs.map((doc) => {
                return (
                    { ...doc.data(), id: doc.id }
                )
            }))
        })
        return () => unsub()
    }, [])
    return data
}