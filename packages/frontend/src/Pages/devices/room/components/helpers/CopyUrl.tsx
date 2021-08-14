import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import copy from 'clipboard-copy';
import { IThing, IThingProperty } from 'common/lib/models/interface/thing';
import { IDevice } from 'common/lib/models/interface/device';
import { useDevice } from 'frontend/src/hooks/useDevice';
import { useThing } from 'frontend/src/hooks/useThing';
import clsx from 'clsx';
import { useLongPress } from 'frontend/src/hooks/useLongPress';

const initialState = {
    mouseX: null,
    mouseY: null,
};

interface CopyUrlContextProps {
    children: JSX.Element | JSX.Element[];
    propertyId: IThingProperty['propertyId'];
    value: string | number;
    className?: string;
}

enum Copy {
    Url,
    Topic,
    Value
}

export function CopyUrlContext({ children, propertyId, value, className }: CopyUrlContextProps) {
    const { _id: deviceId, metadata } = useDevice();
    const { config } = useThing();
    const bind = useLongPress(mouseClick, touchClick, 700);

    const [state, setState] =
        React.useState<{
            mouseX: null | number;
            mouseY: null | number;
        }>(initialState);

    function mouseClick(event: React.MouseEvent<HTMLDivElement>) {
        event.preventDefault();

        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    }

    function touchClick(event: React.TouchEvent<HTMLDivElement>) {
        event.preventDefault();

        setState({
            mouseX: event.touches[0].clientX - 2,
            mouseY: event.touches[0].clientY - 4,
        });
    }

    const handleClose = (action: Copy | boolean = false) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            switch (action) {
                case Copy.Url:
                    const url = `${window.location.origin}/api/device/${deviceId}/thing/${config.nodeId}?property=${propertyId}&value=${value}`;
                    copy(url)
                    break;
                case Copy.Topic:
                    const topic = `v2/${metadata.realm}/${metadata.deviceId}/${config.nodeId}/${propertyId}`;
                    copy(topic)
                    break;
                case Copy.Value:
                    copy(String(value))
                    break;
            }
            setState(initialState);
        };
    };

    return (
        <div {...bind} onContextMenu={mouseClick} className={clsx(className)}>
            {children}
            <Menu
                keepMounted
                open={state.mouseY !== null}
                onClose={handleClose()}
                anchorReference="anchorPosition"
                anchorPosition={
                    state.mouseY !== null && state.mouseX !== null
                        ? { top: state.mouseY, left: state.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={handleClose(Copy.Url)}>Kopírovat URL</MenuItem>
                <MenuItem onClick={handleClose(Copy.Topic)}>Kopírovat téma</MenuItem>
                <MenuItem onClick={handleClose(Copy.Value)}>Kopírovat hodnotu</MenuItem>
            </Menu>
        </div>
    );
}
