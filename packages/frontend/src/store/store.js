import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createState } from './initState';


const composeEnhancers = composeWithDevTools({
    trace: true,
    traceLimit: 25,
});

export default (function configureStore() {
    return createStore(
        rootReducer,
        createState(),
        composeEnhancers(
            applyMiddleware(thunk),
        ),
    );
})();