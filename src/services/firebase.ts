// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Cole as SUAS chaves aqui!
const firebaseConfig = {
  apiKey: "AIzaSyCz1uqxV569t0Gx_jh64ySsbNC5QPOvj0w",
  authDomain: "buscaleads-749d3.firebaseapp.com",
  projectId: "buscaleads-749d3",
  storageBucket: "buscaleads-749d3.firebasestorage.app",
  messagingSenderId: "103012961714",
  appId: "1:103012961714:web:74c980d0e45c3f32eae8ab"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o serviço de Autenticação
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();