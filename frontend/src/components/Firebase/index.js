import {initializeApp} from 'firebase/app'
import {getDatabase} from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyDYBEhMHoXjiZWgnvi1cteewz-EcSMzwr0',
  authDomain: 'dust-d36e5.firebaseapp.com',
  databaseURL:
    'https://dust-d36e5-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'dust-d36e5',
  storageBucket: 'dust-d36e5.appspot.com',
  messagingSenderId: '408995580367',
  appId: '1:408995580367:web:3c5a24f7dd63a4b0282aba',
}

const app = initializeApp(firebaseConfig)
const Firebase = getDatabase(app)
export default Firebase
