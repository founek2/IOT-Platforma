import { ActionFromReducersMapObject, combineReducers, Reducer, StateFromReducersMapObject } from '@reduxjs/toolkit';
import { api } from '../../endpoints/api';
import application from './application';
import formsData from './formDataSlice';
import plugins from './pluginsSlice';
import notifications from './notificationSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import preferences from './preferences';

const reducers = {
    [api.reducerPath]: api.reducer,
    application,
    preferences,
    formsData,
    notifications,
    plugins,
};

type ReducersMapObject = typeof reducers;

const rootReducer = combineReducers(reducers);

const persistConfig = {
    key: 'application',
    storage,
    blacklist: [api.reducerPath],
};

export default persistReducer(persistConfig, rootReducer) as unknown as Reducer<
    StateFromReducersMapObject<ReducersMapObject>,
    ActionFromReducersMapObject<ReducersMapObject>
>;
