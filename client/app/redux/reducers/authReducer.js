import { LOG_IN, LOG_OUT, UPDATE_USER } from "../actions/Types";

initialState = {
    loggedIn: false,
    token: null,
    expiry: null,
    userId: null,
    user: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOG_IN:
            return { ...state, loggedIn: true, token: action.payload.token, expiry: action.payload.expiry, userId: action.payload.userId, user: action.payload.user };

        case LOG_OUT:
            return { ...state, loggedIn: false, token: null, expiry: null, userId: null, user: null };

        case UPDATE_USER:
            return { ...state, user: action.payload.user };

        default:
            return state;
    }
}

export default authReducer;