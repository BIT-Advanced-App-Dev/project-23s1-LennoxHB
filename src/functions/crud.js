import { setDoc, collection, deleteDoc, getDoc, getDocs, updateDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from "react"
import { firestore } from '../firebase';

export const getDocuments = async (query) => {
    try {
        return await getDocs(query)
    } catch (error) {
        console.log(error.message)
    }
}

export const getDocument = async (query) => {
    try {
        return await getDoc(query)
    } catch (error) {
        console.log(error.message)
    }
}
export const createDocument = async (ref, data) => {
    try {
        await setDoc(ref, data)
    } catch (error) {
        console.log(error.message)
    }
}

export const deleteDocument = async (doc) => {
    try {
        await deleteDoc(doc)
    } catch (error) {
        console.log(error.message)
    }
}

export const updateDocument = async (doc, data) => {
    try {
        await updateDoc(doc, data)
    } catch (error) {
        console.log(error.message)        
    }
}

export const useOnSnapshot = (ref) => {    
    const [data, setData] = useState([])
    useEffect(() => {
        const unsub = onSnapshot(collection(firestore, ref), (shot) => {
            setData(shot.docs.map((doc) => (
                { ...doc.data(), id: doc.id }
            )))
        })
        return () => unsub()
    }, [])    
    return data
}