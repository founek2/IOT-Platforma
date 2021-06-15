import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { IState } from '../types';

export const useAppSelector: TypedUseSelectorHook<IState> = useSelector;
