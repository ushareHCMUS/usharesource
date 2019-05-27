import groupReducer from './groupReducer';
import authReducer from './authReducer'
import newsReducer from './newsReducer'
import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase'

const rootReducer = combineReducers({
  auth: authReducer,
  groups: groupReducer,
  news: newsReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer;