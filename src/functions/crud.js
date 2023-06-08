import { setDoc, collection, deleteDoc, getDoc, getDocs, updateDoc, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from "react"
import { firestore } from '../firebase';

export const getDocuments = async (query) => {
    return await getDocs(query)
}

export const getDocument = async (query) => {
    return await getDoc(query)
}
export const createDocument = async (ref, data) => {
    await setDoc(ref, data)
}

export const deleteDocument = async (doc) => {
    await deleteDoc(doc)
}

export const updateDocument = async (doc, data) => {
    await updateDoc(doc, data)
}

export const useOnSnapshot = (ref) => {
    const [data, setData] = useState([])
    useEffect(() => {        
        const q = query(collection(firestore, ref), where("started", "==", false))
        const unsub = onSnapshot(q, (shot) => {
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