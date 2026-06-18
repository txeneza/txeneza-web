import { env } from "./env";

// Inicialização Firebase (Deixado em aberto ou configurado como base)
// Poderá ser facilmente substituído ou estendido com Supabase/outro backend.

export const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
};

// Exemplo de export:
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// 
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// export const auth = getAuth(app);
// export const db = getFirestore(app);

export const db = null as any; // Firestore placeholder
export const authInstance = null as any; // Firebase Auth placeholder
