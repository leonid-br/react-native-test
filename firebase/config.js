import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyDm7a8Pds_hgURGsIO6YuBur1UZsfn2Th0',
    authDomain: 'rn-social-95ed4.firebaseapp.com',
    projectId: 'rn-social-95ed4',
    storageBucket: 'rn-social-95ed4.appspot.com',
    messagingSenderId: '397111260142',
    appId: '1:397111260142:web:bcd675f960da3c300954ff',
    measurementId: 'G-ZDW6JP80CW',
};

export const app = initializeApp(firebaseConfig);
export const authUser = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
