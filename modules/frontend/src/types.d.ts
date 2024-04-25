import { validationMessageKey } from 'common/src/localization/validationMessages';
import { Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './store';

type MakeOptional<Type, Key extends keyof Type> = Omit<Type, Key> & Partial<Pick<Type, Key>>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;

type Cons<H, T> = T extends readonly any[]
    ? ((h: H, ...t: T) => void) extends (...r: infer R) => void
    ? R
    : never
    : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];

type Paths<T, D extends number = 10> = [D] extends [never]
    ? never
    : T extends object
    ? {
        [K in keyof T]-?: [K] | (Paths<T[K], Prev[D]> extends infer P ? (P extends [] ? never : Cons<K, P>) : never);
    }[keyof T]
    : [];

type Leaves<T, D extends number = 10> = [D] extends [never]
    ? never
    : T extends object
    ? { [K in keyof T]-?: Cons<K, Leaves<T[K], Prev[D]>> }[keyof T]
    : [];

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
