import { RootState } from '../store';

export const getNotifications = (state: RootState) => state.notifications;

export const isLoggedIn = (state: RootState) => state.application.authorization.loggedIn;

export const getCurrentUserName = (state: RootState) => state.application.authorization.currentUser?.info.userName;
