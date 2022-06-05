import React from 'react';
import Menu from '@material-ui/core/Menu';

const initialState = {
    mouseX: null,
    mouseY: null,
};

export default function ContextMenu({ children, renderItems = (closeCb: any) => null }) {
    const [state, setState] = React.useState(initialState);

    const handleClick = (event) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    const handleClose = () => {
        setState(initialState);
    };

    return (
        <div onContextMenu={handleClick} style={{ cursor: 'context-menu' }}>
            {children}
            <Menu
                keepMounted
                open={state.mouseY !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    state.mouseY !== null && state.mouseX !== null
                        ? { top: state.mouseY, left: state.mouseX }
                        : undefined
                }
            >
                {renderItems(handleClose)}
            </Menu>
        </div>
    );
}
