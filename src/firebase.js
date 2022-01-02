import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB8gNwzQ5Wg1sZwenOb0C0RrtI_ynKUmmE",
  authDomain: "portfolio-generator-224a3.firebaseapp.com",
  projectId: "portfolio-generator-224a3",
  storageBucket: "portfolio-generator-224a3.appspot.com",
  messagingSenderId: "903240073208",
  appId: "1:903240073208:web:edcb6b870943dc1831600d",
};

const firebase = initializeApp(firebaseConfig);
const storage = getStorage(firebase);
export default storage;
