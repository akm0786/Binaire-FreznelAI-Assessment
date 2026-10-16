// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { OfflineAuthCache } from '../offline/OfflineAuthCache.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLoJhtOo1G6KfDU7MRYYNw4E8yOTLRs44",
  authDomain: "assestment-binaire.firebaseapp.com",
  projectId: "assestment-binaire",
  storageBucket: "assestment-binaire.firebasestorage.app",
  messagingSenderId: "296140138528",
  appId: "1:296140138528:web:082042de961b01f269b445",
  measurementId: "G-N731E6HDSC"
};

export class FirebaseAuthService {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.offlineCache = new OfflineAuthCache();
  }

  async signUp(email, password) {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email.trim(),
      password
    );
    this.offlineCache.saveSession(userCredential.user);
    return userCredential.user;
  }

  async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email.trim(),
      password
    );
    this.offlineCache.saveSession(userCredential.user);
    return userCredential.user;
  }
}