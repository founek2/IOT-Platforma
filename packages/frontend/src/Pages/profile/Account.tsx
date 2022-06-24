import { useAppDispatch } from 'frontend/src/hooks';
import { getUser } from 'frontend/src/utils/getters';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userActions } from 'src/store/actions/application/user';
import EditUser from '../userManagement/EditUser';

function Account() {
    const user = useSelector(getUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    if (!user) return <p>Načítám data...</p>;
    return (
        <EditUser
            onButtonClick={async () => {
                const ok = await dispatch(userActions.updateUser(user._id));
                if (ok) navigate(-1);
            }}
            user={user}
        />
    );
}

export default Account;
