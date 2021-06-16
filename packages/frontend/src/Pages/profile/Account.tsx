import { getUser } from 'framework-ui/lib/utils/getters';
import { IState } from 'frontend/src/types';
import React from 'react';
import { useSelector } from 'react-redux';
import EditUser from '../userManagement/EditUser';
import { userActions } from 'framework-ui/lib/redux/actions/application/user';
import { useAppDispatch } from 'frontend/src/hooks';

function Account() {
    const user = useSelector<IState, IState['application']['user']>(getUser);
    const dispatch = useAppDispatch();

    if (!user) return <p>Načítám data...</p>;
    return (
        <EditUser
            onButtonClick={async () => {
                await dispatch(userActions.updateUser(user._id));
            }}
            user={user}
        />
    );
}

export default Account;
