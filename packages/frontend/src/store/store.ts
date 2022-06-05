import { configureStore } from '@reduxjs/toolkit';
import { hydrateState } from 'framework-ui/src/redux/actions';
import formsData from 'framework-ui/src/redux/reducers/formsData';
import history from 'framework-ui/src/redux/reducers/history';
import application from './reducers/application';
import fieldDescriptors from './reducers/fieldDescriptors';
import accessTokens from './reducers/accessTokens';

const preloadedState = hydrateState();

const store = configureStore({
    reducer: {
        accessTokens,
        application,
        formsData,
        history,
        fieldDescriptors,
    },
    // devTools: process.env.NODE_ENV !== 'production',
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
