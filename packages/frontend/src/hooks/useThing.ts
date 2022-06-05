import { createContext, useContext } from 'react';
import { IThing } from 'common/src/models/interface/thing';

export const ThingContext = createContext<IThing>({} as IThing);

export function useThing() {
    return useContext(ThingContext);
}
