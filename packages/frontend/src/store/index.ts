import { configureStore, isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { api } from '../endpoints/api.js';
import rootReducer from './slices/index.js';
import { notificationActions } from './slices/notificationSlice.js';
import errorMessages from 'common/src/localization/error.js';
import { authorizationActions } from './slices/application/authorizationActions.js';

export const rtkQueryErrorLogger: Middleware =
    ({ dispatch }) =>
        (next) =>
            (action) => {
                // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
                if (isRejectedWithValue(action)) {
                    console.error(action)
                    const payload = action.payload as { data?: { error?: string } } | undefined;
                    if (payload?.data?.error === 'invalidToken') {
                        dispatch(authorizationActions.signOut() as any);
                        dispatch(notificationActions.add({ message: errorMessages.getMessage("invalidToken"), options: { variant: 'warning' } }))
                    } else if (payload?.data?.error) {
                        dispatch(
                            notificationActions.add({
                                message: errorMessages.getMessage(payload.data.error as any),
                                options: { variant: 'error' },
                            })
                        );
                    } else {
                        dispatch(notificationActions.add({ message: 'Nastala chyba', options: { variant: 'error' } }))
                    };
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
