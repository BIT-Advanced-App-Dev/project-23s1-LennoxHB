import { addDoc, setDoc, deleteDoc, getDoc, getDocs, updateDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from "react"

// Gets data from a set of documents using a query.
export const getDocuments = async (query) => {
    const snapshot = await getDocs(query)
    return snapshot.docs.map((doc) => {
        return (
            { ...doc.data(), id: doc.id }
        )
    })
}

// Returns a single document from a query
export const getDocument = async (query) => {
    const doc = await getDoc(query)
    return { ...doc.data(), id: doc.id }
}

// Update or create document using a doc reference and data to be changed / added.
export const setDocument = async (ref, data) => {
    return await setDoc(ref, data)
}

// Create a new document with collection ref and data, sets id automatically
export const createDocument = async (ref, data) => {
    const create = await addDoc(ref, data)
    return create.id
}

// Delete a document from a doc ref
export const deleteDocument = async (doc) => {
    await deleteDoc(doc)
}

// Update a document from a doc reference and data to be changed / added.
export const updateDocument = async (doc, data) => {
    await updateDoc(doc, data)
}

// Listens to changes to a document and returns the latest version.
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

// Listens to changes to a collection of documents and returns the latest versions.
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