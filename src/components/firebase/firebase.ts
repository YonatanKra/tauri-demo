import { FirebaseApp, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIREBASE_APP_KEY}`,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}`,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: `${import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${import.meta.env.VITE_FIREBASE_APP_ID}`,
};

export const app = initializeApp(firebaseConfig);

export class Firebase extends HTMLElement {

    app: FirebaseApp = app;

}