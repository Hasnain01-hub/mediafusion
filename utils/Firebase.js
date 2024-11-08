import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwcKLgMKXHfx4GsJsmot8DFPSxBOYR-ig",
  authDomain: "chatbot-b9a95.firebaseapp.com",
  projectId: "chatbot-b9a95",
  storageBucket: "chatbot-b9a95.appspot.com",
  messagingSenderId: "619344414244",
  appId: "1:619344414244:web:51a7f2046407c26a08bab1",
};
// Initialize Firebase

export const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const db = app.firestore();
export const logout1 = () => {
  auth.signOut();
};
