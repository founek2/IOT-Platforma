import { useEffect } from 'react';
import webSocket from '../webSocket';
import { connect } from 'react-redux';
import { getToken } from 'framework-ui/src/utils/getters';

function WebSocket({ children, token }) {
    useEffect(() => {
        webSocket.init(token);
    }, [token]);

    return children;
}

const _mapStateToProps = (state) => ({
    token: getToken(state),
});

export default connect(_mapStateToProps)(WebSocket);
