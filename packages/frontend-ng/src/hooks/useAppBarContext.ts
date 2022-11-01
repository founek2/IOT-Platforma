import React, { createContext, useContext } from 'react';

export type AppBarContextType = {
    data: [header: string, Icon: JSX.Element | null];
    setAppHeader: (headerText: string, Icon?: JSX.Element) => void;
    resetAppHeader: () => void;
};

export const defaultAppBarCtx: AppBarContextType = {
    data: ['', null],
    setAppHeader: () => {},
    resetAppHeader: () => {},
};
export const AppBarContext = createContext<AppBarContextType>(defaultAppBarCtx);

export function useAppBarContext() {
    return useContext(AppBarContext);
}
