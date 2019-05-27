const initState = {
    authError: null,
    uid: null
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case "LOGIN_ERROR":
            console.log(action.err.code);
            return {
                ...state,
                authError: action.err.code
            }
        case 'LOGIN_SUCCESS':
            console.log('Login success');
            return {
                ...state,
                authError: null
            }
        case 'SIGNOUT_SUCCESS':
            console.log("Signout success");
            return state;
        default: return state
    }
}

export default authReducer