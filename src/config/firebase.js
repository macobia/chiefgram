// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, query, where, getDocs, collection } from "firebase/firestore";
import { toast } from "react-toastify";



const firebaseConfig = {
  apiKey: "AIzaSyBkvloorRHfZrGhA00RCUpifsAdqltJOS0",
  authDomain: "chiefgram-mac.firebaseapp.com",
  projectId: "chiefgram-mac",
  storageBucket: "chiefgram-mac.firebasestorage.app",
  messagingSenderId: "500952907319",
  appId: "1:500952907319:web:9c7841df3c9a67e3bb49b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    console.log("User created:", user);
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username ? username.toLowerCase() : "",
      email,
      name: "",
      avatar: "",
      bio: "Hey there! I am using Chiefgram",
      lastSeen: Date.now()
    })
    await setDoc(doc(db, "chats", user.uid), {
      chatsData: []
    })
    
  } catch (error) {
    console.error(error)
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }

}

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword (auth, email,password);
  
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));

  }

}

const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
    
  }
  
}

const resetPass = async (email) => {
  if (!email) {
    toast.error("Enter your email address")
    return null;
    
  }
  try {
    const userRef = collection(db, 'users'); 
    const q = query(userRef, where("email", "==", email));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset Email Sent")
    } 
    else {
      toast.error("Email address not found")
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
    
  }
}
export {signup,login, logout, auth, db, resetPass}