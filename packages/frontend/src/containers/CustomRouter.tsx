import { historyActions } from 'framework-ui/src/redux/actions/history';
import { historyReducerActions } from 'framework-ui/src/redux/reducers/history';
import parseQuery from 'framework-ui/src/utils/parseQuery';
import { BrowserHistory } from 'history';
import React, { ReactNode } from 'react';
import { Router } from 'react-router-dom';
import { useAppDispatch } from 'src/hooks';
import '../firebase'; // init

interface CustomRouterProps {
    children: ReactNode;
    history: BrowserHistory;
}

export function CustomRouter({ children, history }: CustomRouterProps) {
    const dispatch = useAppDispatch();
    const [state, setState] = React.useState({
        action: history.action,
        location: history.location,
    });

    React.useLayoutEffect(() => {
        const lastHistory = localStorage.getItem('history');
        const targetLocation =
            lastHistory && history.location.pathname === '/' ? JSON.parse(lastHistory) : history.location;

        dispatch(
            historyActions.set({
                pathname: targetLocation.pathname,
                hash: targetLocation.hash,
                search: targetLocation.search,
                query: parseQuery(targetLocation.search),
            })
        );

        history.listen((update) => {
            const { key, state, ...rest } = update.location;
            dispatch(
                historyReducerActions.set({
                    ...rest,
                    query: parseQuery(rest.search),
                })
            );

            setState(update);
            localStorage.setItem('history', JSON.stringify(rest));
        });

        // Sync history with redux
        history.push(targetLocation);
    }, [history, dispatch]);

    return <Router basename="/" children={children} location={state.location} navigator={history} />;
}
