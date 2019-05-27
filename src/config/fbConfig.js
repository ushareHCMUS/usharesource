import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

var config = {
    apiKey: "AIzaSyB4v2Fc-GxehiGCG8tCOVnbtn3WBKiSk2I",
    authDomain: "ushare-5a7b5.firebaseapp.com",
    databaseURL: "https://ushare-5a7b5.firebaseio.com",
    projectId: "ushare-5a7b5",
    storageBucket: "ushare-5a7b5.appspot.com",
    messagingSenderId: "573956070821"
};
firebase.initializeApp(config);

export default firebase;