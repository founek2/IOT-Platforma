import { RootState } from '../store';

export const getApplication = (state: RootState) => state.application;
export const isLoggedIn = (state: RootState) => state.application.authorization.loggedIn;
