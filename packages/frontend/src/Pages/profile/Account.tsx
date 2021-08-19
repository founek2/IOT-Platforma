import { userActions } from 'framework-ui/lib/redux/actions/application/user';
import { useAppDispatch } from 'frontend/src/hooks';
import { getUser } from 'frontend/src/utils/getters';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import EditUser from '../userManagement/EditUser';

function Account() {
    const user = useSelector(getUser);
    const dispatch = useAppDispatch();
    const history = useHistory();

    if (!user) return <p>Načítám data...</p>;
    return (
        <EditUser
            onButtonClick={async () => {
                const ok = await dispatch(userActions.updateUser(user._id));
                if (ok) history.goBack();
            }}
            user={user}
        />
    );
}

export default Account;
