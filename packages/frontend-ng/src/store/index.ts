import { CombinedState, configureStore, isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { api } from '../services/api';
import rootReducer from './slices';
import { notificationActions } from './slices/notificationSlice';
import { $CombinedState } from '@reduxjs/toolkit';

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
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
            .concat(api.middleware)
            .concat(rtkQueryErrorLogger),
});

// Hot reload support
if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./slices', () => store.replaceReducer(rootReducer));
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
