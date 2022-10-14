import { combineReducers } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import application from './application';
import formsData from './formDataSlice';
import notifications from './notificationSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
    application,
    formsData,
    notifications,
});

const persistConfig = {
    key: 'application',
    storage,
    blacklist: [api.reducerPath],
};

export default persistReducer(persistConfig, rootReducer);
