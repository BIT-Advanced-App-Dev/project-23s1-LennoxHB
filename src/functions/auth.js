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

// Returns the name of currently logged in user
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

// Register a new user and set displayName
export const register = async (req) => {
    const { email, password, displayName } = req
    await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(auth.currentUser, { displayName: displayName })
    const userDoc = doc(firestore, "users", auth.currentUser.displayName)
    await setDoc(userDoc, { displayName: displayName })
}

// Login user
export const login = async (req) => {
    const { email, password } = req
    await signInWithEmailAndPassword(auth, email, password)
}

// Logout user
export const logout = async () => {
    await signOut(auth)
}