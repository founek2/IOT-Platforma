import {
    AnyAction,
    combineReducers,
    configureStore,
    isRejectedWithValue,
    Middleware,
    MiddlewareAPI,
} from '@reduxjs/toolkit';
import { api } from '../services/api';
import application from './slices/application';
import formsData from './slices/formDataSlice';
import notifications, { notificationActions } from './slices/notificationSlice';
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

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const rtkQueryErrorLogger: Middleware =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
        if (isRejectedWithValue(action)) {
            // console.warn('We got a rejected action!');
            //   toast.warn({ title: 'Async error!', message: action.error.data.message })
            dispatch(notificationActions.add({ message: 'Nastala chyba', options: { variant: 'error' } }));
        }

        return next(action);
    };

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
            .concat(api.middleware)
            .concat(rtkQueryErrorLogger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
