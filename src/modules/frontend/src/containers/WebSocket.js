import React, { useEffect } from 'react'
import webSocket from '../webSocket'
import LoginCallbacks from 'framework-ui/src/callbacks/login'
import LogoutCallbacks from 'framework-ui/src/callbacks/logout'
import { connect } from 'react-redux'
import { hydrateState } from 'framework-ui/src/redux/actions'
import { getToken } from 'framework-ui/src/utils/getters'
import { bindActionCreators } from 'redux'

function WebSocket({ children, token }) {
    useEffect(() => {
        webSocket.init()

        LoginCallbacks.register((token) => webSocket.init(token))
        LogoutCallbacks.register(() => webSocket.init())
    }, [])

    return children;
}

const _mapStateToProps = (state) =>({
            token: getToken(state),
        })

export default connect(_mapStateToProps)(WebSocket)