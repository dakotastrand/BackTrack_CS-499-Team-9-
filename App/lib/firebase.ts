// App/lib/firebase.ts
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtEEI9-zqUkFs-kMbm0UhOFO2d81A60Os",
  authDomain: "backtrack-bc8fc.firebaseapp.com",
  projectId: "backtrack-bc8fc",
  storageBucket: "backtrack-bc8fc.firebasestorage.app",
  messagingSenderId: "134345247813",
  appId: "1:134345247813:web:dbb2e400d38589a668e72c",
};

// Only initialize once (Fast Refresh / hot reload safe)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
