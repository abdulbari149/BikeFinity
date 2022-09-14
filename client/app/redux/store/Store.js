import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from '../reducers/authReducer';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

const rootReducer = combineReducers({
    auth: persistReducer(persistConfig, authReducer),
});

export const store = createStore(rootReducer);
export const persistor = persistStore(store);
