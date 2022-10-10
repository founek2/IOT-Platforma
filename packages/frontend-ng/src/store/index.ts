import { configureStore, isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { api } from '../services/api';
import application from './slices/application';
import notifications from './slices/notifications';

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
        console.warn('We got a rejected action!');
        //   toast.warn({ title: 'Async error!', message: action.error.data.message })
    }

    return next(action);
};

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        application,
        notifications,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware).concat(rtkQueryErrorLogger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
