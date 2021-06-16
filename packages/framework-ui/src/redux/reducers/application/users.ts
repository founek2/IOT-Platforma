import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { append, equals, filter, map, merge, not, o, prop } from 'ramda';

const filterById = (id: any) => (userObj: { _id?: any }) => o(not, equals(id))(prop('_id', userObj));

// Define a type for the slice state
export type UsersState = { _id?: any }[];

// Define the initial state using that type
const initialState: UsersState = [];

export const usersSlice = createSlice({
    name: 'users',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        set: (state, action: PayloadAction<UsersState>) => {
            return action.payload;
        },
        toDefault: () => {
            return initialState;
        },
        remove: (state, action: PayloadAction<any>) => {
            const newState = filter(filterById(action.payload), state);
            return newState;
        },
        add: (state, action: PayloadAction<{ _id?: any }>) => {
            const newState = append(action.payload, state);
            return newState;
        },
        updateMultiple: (state, action: PayloadAction<UsersState>) => {
            let newState = state;
            action.payload.forEach((userUpdate) => {
                const updateUser = (userObj: { _id?: any }) => {
                    if (userObj._id === userUpdate._id) {
                        return merge(userObj, userUpdate);
                    }
                    return userObj;
                };
                newState = map(updateUser, state);
            });

            return newState;
        },
    },
});

export const usersReducerActions = usersSlice.actions;

export default usersSlice.reducer;
