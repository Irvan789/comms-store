/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
    getFirestore,
    getDocs,
    collection,
    doc,
    getDoc,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore'
import app from './init'
import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable
} from 'firebase/storage'
import { IUsers } from '@/types/database'

const firestore = getFirestore(app)

const storage = getStorage(app)

export async function retrieveData(collectionName: string) {
    const snapshot = await getDocs(collection(firestore, collectionName))
    const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))

    return data
}

export async function retrieveDataById(collectionName: string, id: string) {
    const snapshot = await getDoc(doc(firestore, collectionName, id))
    const data = snapshot.data()
    return data
}

export async function retrieveDataByField(
    collectionName: string,
    field: string,
    value: string
) {
    const q = query(
        collection(firestore, collectionName),
        where(field, '==', value)
    )

    const snapshot = await getDocs(q)
    const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))

    return data[0] as IUsers
}

export async function addData(
    collectionName: string,
    data: any,
    callback: Function
) {
    await addDoc(collection(firestore, collectionName), data)
        .then(res => {
            callback(true, res)
        })
        .catch(() => {
            callback(false)
        })
}

export async function updateData(
    collectionName: string,
    id: string,
    data: any,
    callback: Function
) {
    const docRef = doc(firestore, collectionName, id)
    await updateDoc(docRef, data)
        .then(() => {
            callback(true)
        })
        .catch(() => {
            callback(false)
        })
}

export async function deleteData(
    collectionName: string,
    id: string,
    callback: Function
) {
    const docRef = doc(firestore, collectionName, id)
    await deleteDoc(docRef)
        .then(() => {
            callback(true)
        })
        .catch(() => {
            callback(false)
        })
}

export async function uploadFile(
    id: string,
    file: any,
    newName: string,
    collection: string,
    callback: Function
) {
    if (file) {
        if (file.size < 1048576) {
            const storageRef = ref(
                storage,
                `images/${collection}/${id}/${newName}`
            )
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                'state_changed',
                snapshot => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    // console.log('Upload is ' + progress + '% done')
                },
                error => {
                    console.log(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL: any) => {
                            callback(true, downloadURL)
                        }
                    )
                }
            )
        } else {
            return callback(false)
        }
    }

    return true
}

export async function deleteFile(url: string, callback: Function) {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
        .then(() => {
            callback(true)
        })
        .catch(() => {
            callback(false)
        })
}
