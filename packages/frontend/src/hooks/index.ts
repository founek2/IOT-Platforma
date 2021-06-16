import { useSelector, TypedUseSelectorHook, useDispatch } from 'react-redux';
import { IState } from '../types';
import { AppDispatch } from '../store/store';

export const useAppSelector: TypedUseSelectorHook<IState> = useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();
