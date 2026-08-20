import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  signOut as fbSignOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    return result;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      // Return null rather than crashing so the UI can gracefully cancel
      return null;
    }
    console.warn('Google sign in warning:', error.code || error.message);
    throw error;
  }
};

export const signInWithEmail = async (email: string, pass: string) => {
  return await signInWithEmailAndPassword(auth, email, pass);
};

export const registerWithEmail = async (email: string, pass: string, displayName?: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential;
};

export const signInAsGuestUser = async () => {
  return await signInAnonymously(auth);
};

export const logoutUser = async () => {
  try {
    await fbSignOut(auth);
  } catch (e) {
    console.warn('Signout warning:', e);
  }
};
