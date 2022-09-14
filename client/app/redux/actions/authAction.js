import { LOG_IN, LOG_OUT, UPDATE_USER } from './Types';

const LogIn = (token, expiry, userId, user) => {
    return {
        type: LOG_IN,
        payload: {
            token: token,
            expiry: expiry,
            userId: userId,
            user: user
        }
    }
}

const LogOut = () => {
    return {
        type: LOG_OUT
    }
}

const UpdateUser = (user) => {
    return {
        type: UPDATE_USER,
        payload: {
            user: user
        }
    }
}
export { LogIn, LogOut, UpdateUser };