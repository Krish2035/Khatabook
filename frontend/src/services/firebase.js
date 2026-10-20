import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC6Z0WqiOnOsE8TML8d1Uk4L8r6zneeszM",
  authDomain: "khatabook-b74c7.firebaseapp.com",
  projectId: "khatabook-b74c7",
  storageBucket: "khatabook-b74c7.firebasestorage.app",
  messagingSenderId: "278282784111",
  appId: "1:278282784111:web:189f876419af5f6e18ec9a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGooglePopup = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  return {
    uid: user.uid,
    displayName: user.displayName || 'Google User',
    email: user.email,
    photoURL: user.photoURL,
    accessToken: await user.getIdToken(),
  };
};

export default app;
