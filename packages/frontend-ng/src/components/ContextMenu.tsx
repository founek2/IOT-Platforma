import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { render } from 'react-dom';

interface ContextMenuProps {
    renderMenuItems: (onClose: () => any) => JSX.Element | (React.ReactElement | null)[];
    render: (props: { menuList: JSX.Element; onContextMenu: (event: React.MouseEvent) => any }) => JSX.Element;
}
export function ContextMenu({ renderMenuItems, render }: ContextMenuProps) {
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
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
