import { clone } from 'ramda';
import { STATE_DEHYDRATED } from '../../constants/redux';
import { logger } from '../../logger';
import { getItem, removeItem, setItem } from '../../storage';
import parseJwtToken from '../../utils/parseJwtToken';

export function dehydrateState() {
    return function (dispatch: any, getState: any) {
        logger.warning(STATE_DEHYDRATED);

        const { formsData, application } = clone(getState());
        delete application.notifications;
        delete formsData.registeredFields;

        // TODO přidal callback na úpravu statu před dehydratací
        if (application.sensors) delete application.sensors;

        setItem(STATE_DEHYDRATED, JSON.stringify({ formsData, application, dehydrationTime: new Date() }));
    };
}

export function hydrateState() {
    const hydratedState = getItem(STATE_DEHYDRATED);

    if (hydratedState) {
        const state = JSON.parse(hydratedState);

        if (state.application.user && state.application.user.token) {
            const tokenParsed = parseJwtToken(state.application.user.token);
            if (tokenParsed.exp < (new Date().getTime() + 1) / 1000) {
                logger.info('Token expired');
                removeItem(STATE_DEHYDRATED);
                return;
            }
        }
        delete state.dehydrationTime;
        logger.debug('State hydrated');
        return state;
    } else {
        logger.debug('Nothing to hydrate');
    }
    return undefined;
}
