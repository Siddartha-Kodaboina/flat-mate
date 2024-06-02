import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { db } from '../config/firebaseConfig';

export const addTestDocument = async() => {
    try {
        const docRef = await addDoc(collection(db, "testCollection"), {
          name: "Test Document",
          createdAt: new Date(),
        });
      } catch (e) {
        console.error("Error adding document: ", e.message);
        console.error(e); 
      }
}

// Function to get a test document
 export const getTestDocument = async (docId) => {
    try {
        const docRef = doc(db, "testCollection", docId);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (e) {
        console.error("Error getting document: ", e.message);
        console.error(e);  
      }
}

// Call these functions to test
// addTestDocument();
// Call getTestDocument with a valid document ID after adding a document
// getTestDocument("your-document-id");
