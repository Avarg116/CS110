import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj4iZz86Jp-O_kqF7AWBBaWJ02jY_bAsY",
  authDomain: "cs110-f54e6.firebaseapp.com",
  projectId: "cs110-f54e6",
  storageBucket: "cs110-f54e6.appspot.com",
  messagingSenderId: "340458671561",
  appId: "1:340458671561:web:e5f449d21164b1a127ec18",
  measurementId: "G-7GC4SMKJ96"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//auth state
onAuthStateChanged(auth, user => {
  if (user) {
    console.log('User is signed in:', user);
    document.cookie = `__session=${user.accessToken};path=/`;
  } else {
    console.log('No user is signed in.');
    document.cookie = '__session=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }
});

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword };
