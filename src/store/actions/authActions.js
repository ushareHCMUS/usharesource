

export const signIn = (credentials) => {
  console.log("test");
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    ).then(() => {
      console.log('Loginauth:', firebase.auth);
      dispatch({ type: "LOGIN_SUCCESS" });
    }).catch((err) => {
      dispatch({ type: "LOGIN_ERROR", err });
    })
  }
}

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    firebase.auth().signOut().then(() => {
      dispatch({ type: 'SIGNOUT_SUCCESS' });
    })
  }
}