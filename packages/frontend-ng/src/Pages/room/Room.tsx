import DoneIcon from '@mui/icons-material/Done';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import clsx from 'clsx';
import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Draggable, DraggableProvider } from '../../components/Draggable';
import { useAppDispatch, useAppSelector } from '../../hooks/index';
import { useAppBarContext } from '../../hooks/useAppBarContext';
import { getRoomLocation } from '../../selectors/getters';
import { thingPreferencesReducerActions } from '../../store/slices/preferences/thingSlice';
import { byPreferences } from '../../utils/sort';
import { LocationTypography } from '../../components/LocationTypography';
import { ThingWidget } from './widgets/ThingWidget';
import { Dictionary } from '@reduxjs/toolkit';
import { DeviceWidget } from './widgets/DeviceWidget';
import { devicePreferencesReducerActions } from '../../store/slices/preferences/deviceSlice';

interface RoomContentProps {
    thingIDs: string[];
    editMode: boolean;
    onMove: (dragId: string, hoverId: string) => any;
    preferencies: Dictionary<{ _id: string; order: number }>;
    mode: 'things' | 'devices';
}
function RoomContent({ thingIDs, onMove, editMode, mode, preferencies }: RoomContentProps) {
    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} md={7} lg={6} xl={5}>
                <Box
                    sx={(theme) => ({
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(8rem, 1fr))',
                        gap: 2,
                        padding: 2,
                        [theme.breakpoints.up('md')]: {
                            gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))',
                        },
                    })}
                >
                    {thingIDs
                        .map((id) => ({ id: id }))
                        .sort(byPreferences(preferencies))
                        .map(({ id }, idx) => (
                            <Draggable
                                id={id}
                                key={id}
                                index={idx}
                                onMove={onMove}
                                type="thing"
                                dragDisabled={!editMode}
                                render={(isDragable: boolean, ref) =>
                                    mode === 'things' ? (
                                        <ThingWidget
                                            id={id}
                                            sx={{ opacity: isDragable ? 0.4 : 1 }}
                                            ref={ref}
                                            className={clsx({ floating: editMode })}
                                        />
                                    ) : (
                                        <DeviceWidget
                                            id={id}
                                            sx={{ opacity: isDragable ? 0.4 : 1 }}
                                            ref={ref}
                                            className={clsx({ floating: editMode })}
                                        />
                                    )
                                }
                            />
                        ))}
                </Box>
            </Grid>
        </Grid>
    );
}

export interface RoomProps {
    title?: string;
    mode: 'things' | 'devices';
}
export default function Room({ title, mode }: RoomProps) {
    const { room, building } = useParams() as unknown as { building: string; room: string };
    const dispatch = useAppDispatch();
    const preferencies = useAppSelector((state) => state.preferences[mode].entities);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const roomLocation = useAppSelector(getRoomLocation(building, room));
    const { setAppHeader, resetAppHeader } = useAppBarContext();
    const editMode = searchParams.has('edit');

    const IDs = mode === 'things' ? roomLocation?.thingIDs : roomLocation?.deviceIDs;

    const onMove = useCallback(
        (dragId: string, hoverId: string) => {
            if (mode === 'things') {
                dispatch(thingPreferencesReducerActions.swapOrderFor([dragId, hoverId]));
            } else dispatch(devicePreferencesReducerActions.swapOrderFor([dragId, hoverId]));
        },
        [dispatch]
    );

    const prepareEditMode = useCallback(() => {
        if (IDs)
            if (mode === 'things') {
                dispatch(
                    thingPreferencesReducerActions.resetOrderFor(
                        IDs.map((id) => ({ id: id }))
                            .sort(byPreferences(preferencies))
                            .map((r) => r.id)
                    )
                );
            } else {
                dispatch(
                    devicePreferencesReducerActions.resetOrderFor(
                        IDs.map((id) => ({ id: id }))
                            .sort(byPreferences(preferencies))
                            .map((r) => r.id)
                    )
                );
            }
    }, [dispatch, IDs]);

    useEffect(() => {
        return () => resetAppHeader();
    }, []);

    useEffect(() => {
        if (editMode) {
            setAppHeader(
                'Editace',
                <IconButton
                    onClick={() => {
                        navigate({ search: '' }, { replace: true });
                    }}
                >
                    <DoneIcon />
                </IconButton>
            );
            prepareEditMode();
        } else if (title) {
            setAppHeader(title);
        } else resetAppHeader();
    }, [title, editMode, navigate, prepareEditMode]);

    const content = (
        <>
            <LocationTypography location={{ building, room }} showRootSlash={true} />
            <RoomContent
                thingIDs={IDs || []}
                editMode={editMode}
                onMove={onMove}
                mode={mode}
                preferencies={preferencies}
            />
        </>
    );

    if (editMode) return <DraggableProvider>{content}</DraggableProvider>;
    return content;
}
