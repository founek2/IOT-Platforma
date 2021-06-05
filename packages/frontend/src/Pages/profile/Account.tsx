import { getUser } from 'framework-ui/lib/utils/getters';
import { IState } from 'frontend/src/types';
import React from 'react';
import { useSelector, connect } from 'react-redux';
import EditUser from '../userManagement/EditUser';
import { bindActionCreators } from 'redux';
import * as userActions from 'framework-ui/lib/redux/actions/application/user';

function Account({ updateUserAction }: any) {
    const user = useSelector<IState, IState['application']['user']>(getUser);

    if (!user) return <p>Načítám data...</p>;
    return (
        <EditUser
            onButtonClick={async () => {
                const result = await updateUserAction(user._id);
            }}
            user={user}
        />
    );
}

const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            updateUserAction: userActions.updateUser,
        },
        dispatch
    );
export default connect(null, _mapDispatchToProps)(Account);
