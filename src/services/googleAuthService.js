import { auth, provider, db } from '../config/firebaseConfig';
import {signInWithPopup, confirmPasswordReset, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Function to check if a user exists and add them to Firestore if not
const addUserToFirestore = async (user) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName || user.email,
      displayNameLowerCase: user.displayName.toLowerCase() || user.email,
      email: user.email,
      photoURL: user.photoURL || ''
    });
  }
};

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      await addUserToFirestore(user);
    })
    .catch((error) => {
      console.error("Error during sign in: ", error);
      
    });
};

export const signUpWithEmailAndPassword = ({user_name, user_pwd}) => {
  createUserWithEmailAndPassword(auth, user_name, user_pwd)
    .then(async (result) => {
      // Sign Up
      const user = result.user;
      if (user.displayName === null){
        user.displayName = user.email
      }
      await addUserToFirestore(user);
    })
    .catch((error) => {
      console.error("Error during sign up signUpWithEmailAndPassword: ", error);
      alert(error.message);
    });
};

export const signInWithCustomEmailAndPassword = ({user_name, user_pwd}) => {
  signInWithEmailAndPassword(auth, user_name, user_pwd)
    .then((result) => {
      // Sign Up
      const user = result.user;
      if (user.displayName === null){
        user.displayName = user.email
      }
    })
    .catch((error) => {
      console.error("Error during sign in signInWithEmailAndPassword: ", error);
      alert(error.message);
    });
};

export const sendThePasswordResetEmail = ({user_email}) => {
  sendPasswordResetEmail(auth, user_email)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error("Error during sign in sendThePasswordResetEmail: ", error);
      alert(error.message);
    });
};



export const confirmThePasswordReset = ({oobCode, new_password}) => {
  confirmPasswordReset(auth, oobCode, new_password)
    .then(() => {
      console.log("Password reset successful!");
    })
    .catch((error) => {
      console.error("Error during sign in confirmThePasswordReset: ", error);
      alert(error.message);
    });
};
