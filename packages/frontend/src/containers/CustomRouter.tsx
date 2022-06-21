import { historyActions } from 'framework-ui/src/redux/actions/history';
import { historyReducerActions } from 'framework-ui/src/redux/reducers/history';
import parseQuery from 'framework-ui/src/utils/parseQuery';
import { BrowserHistory, createBrowserHistory, History } from 'history';
import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Router } from 'react-router-dom';
import { useAppDispatch } from 'src/hooks';
import '../firebase'; // init

const history = createBrowserHistory();

const defLocation = history.location;
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
        dispatch(
            historyActions.set({
                pathname: defLocation.pathname,
                hash: defLocation.hash,
                search: defLocation.search,
                query: parseQuery(defLocation.search),
            })
        );

        const lastHistory = localStorage.getItem('history');

        if (lastHistory && history.location.pathname === '/') history.push(JSON.parse(lastHistory));

        history.listen((update) => {
            const { key, state, ...rest } = update.location;
            dispatch(
                historyReducerActions.set({
                    ...rest,
                    query: parseQuery(rest.search),
                })
            );

            setState(update);

            // updateTmpDataAction({ dialog: {} });

            localStorage.setItem('history', JSON.stringify(rest));
        });
    }, [history, dispatch]);

    return (
        <Router
            basename="/"
            children={children}
            location={state.location}
            navigationType={state.action}
            navigator={history}
        />
    );
}
