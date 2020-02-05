import React from 'react'
import Box from './BorderBox'

function MyComponent(WrappedComponent) {
    return function (props) {
        return <Box component={WrappedComponent} {...props} />
    }
}

export default MyComponent;