import React from 'react';
import Menu from '@material-ui/core/Menu';

type State = {
    mouseX: null | number;
    mouseY: null | number;
};
const initialState = {
    mouseX: null,
    mouseY: null,
};

export interface ContextMenuProps {
    children: React.ReactNode;
    renderItems: (cb: () => void) => React.ReactNode;
}
export default function ContextMenu({ children, renderItems = (closeCb: any) => null }: ContextMenuProps) {
    const [state, setState] = React.useState<State>(initialState);

    const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
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
