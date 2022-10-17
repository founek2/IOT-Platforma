import Menu from '@mui/material/Menu';
import * as React from 'react';

interface ContextMenuProps {
    renderMenuItems: (onClose: () => any) => JSX.Element | (React.ReactElement | null)[];
    render: (props: {
        menuList: JSX.Element;
        onContextMenu: (event: React.MouseEvent | React.TouchEvent) => any;
    }) => JSX.Element;
    disabled?: boolean;
}
export function ContextMenu({ renderMenuItems, render, disabled }: ContextMenuProps) {
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu = (event: React.MouseEvent | React.TouchEvent) => {
        if (disabled) return;
        if (event.cancelable) event.preventDefault();

        const eventTouch = event as React.TouchEvent;
        if (eventTouch.touches) {
            setContextMenu(
                contextMenu === null
                    ? {
                          mouseX: eventTouch.touches[0].clientX + 2,
                          mouseY: eventTouch.touches[0].clientY - 6,
                      }
                    : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                      // Other native context menus might behave different.
                      // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                      null
            );
        } else {
            event = event as React.MouseEvent;
            setContextMenu(
                contextMenu === null
                    ? {
                          mouseX: event.clientX + 2,
                          mouseY: event.clientY - 6,
                      }
                    : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                      // Other native context menus might behave different.
                      // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                      null
            );
        }
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    return render({
        menuList: (
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
                }
            >
                {renderMenuItems(handleClose)}
            </Menu>
        ),
        onContextMenu: handleContextMenu,
    });
}
