import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyBgZbWqp7pJ22K01k_XFoR-R1ZniG2bFCQ",
    authDomain: "instagram-clone-b0b53.firebaseapp.com",
    databaseURL: "https://instagram-clone-b0b53.firebaseio.com",
    projectId: "instagram-clone-b0b53",
    storageBucket: "instagram-clone-b0b53.appspot.com",
    messagingSenderId: "1047302306885",
    appId: "1:1047302306885:web:77ef98463f7f1d4936f72c",
    measurementId: "G-6M4HR8YV4E"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig); //initialise app 
  const db = firebaseApp.firestore();  // database connect
  const auth = firebase.auth();   // variables for authentication to handle sign in 
  const storage=firebase.storage();

  export { db, auth, storage };  //export is necessary to use outside of file