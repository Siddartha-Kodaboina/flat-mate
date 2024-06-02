import { useEffect, useState } from 'react';
import { auth } from '../config/firebaseConfig'; 

const useFirebaseUser = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.
        const { uid, email, displayName, photoURL } = user;
        setCurrentUser({ uid, email, displayName, photoURL });
      } else {
        // No user is signed in.
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return currentUser;
};

export default useFirebaseUser;
