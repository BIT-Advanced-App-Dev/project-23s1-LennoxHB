import { auth } from '../firebase.js';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth'
import { useEffect, useState } from 'react';
import { firestore } from '../firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile  } from "firebase/auth";

export const useGetUser = () => {
    const [user, setUser] = useState()
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser({
                displayName: currentUser?.displayName
            })
        })
        return () => unsub()
    }, [])
    return user
}

export const register = async (req) => {
    console.log(req)
    // const { email, password, displayName } = req
    // await createUserWithEmailAndPassword(auth, email, password)
    // await updateProfile(auth.currentUser, { displayName: displayName })
    // const userDoc = doc(firestore, "users", auth.currentUser.uid)
    // await setDoc(userDoc, { displayName: displayName })
}

export const login = async (req) => {
    const { email, password } = req
    await signInWithEmailAndPassword(auth, email, password)
}

export const logout = async () => {
    await signOut(auth)
}