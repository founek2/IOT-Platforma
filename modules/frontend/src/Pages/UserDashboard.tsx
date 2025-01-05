import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import { CircularProgress, Grid, IconButton, Paper } from '@mui/material';
import clsx from 'clsx';
import { notEmpty } from 'common/src/utils/notEmpty';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dialog } from '../components/Dialog';
import { Draggable, DraggableProvider } from '../components/Draggable';
import PropertySelect, { PropertySelectEvent } from '../components/PropertySelect';
import { useDevicesAllQuery } from '../endpoints/devices';
import { useUpdateThingStateMutation } from '../endpoints/thing';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useAppBarContext } from '../hooks/useAppBarContext';
import { ThingContext } from '../hooks/useThing';
import { PropertyPreferences, propertyPreferencesReducerActions } from '../store/slices/preferences/dashboardSlice';
import { byPreferences } from '../utils/sort';
import PropertyRow from './room/PropertyRow';

function Properties({ editMode, onMove }: { editMode: boolean; onMove: (dragId: string, hoverId: string) => any }) {
    const preferences = useAppSelector((state) => state.preferences.dashboard.entities);
    const thingsEntities = useAppSelector((state) => state.application.things.entities);
    const [updatePropertyState] = useUpdateThingStateMutation();

    const config = Object.values(preferences) as PropertyPreferences[];

    const properties = Object.values(thingsEntities)
        .flatMap((thing) => {
            if (!thing || !config.some((c) => c.thingId === thing._id)) return;

            const properties = thing.config.properties
                .filter((property) => preferences[property._id!])
                .filter(notEmpty);
            return properties.map((property) => ({ thing, property }));
        })
        .filter(notEmpty);

    const sorted = properties.map((t) => ({ ...t, id: t.property._id! })).sort(byPreferences(preferences));

    return (
        <>
            {sorted.map(({ property, thing }, idx) => (
                <Draggable
                    id={property._id!}
                    key={property._id}
                    index={idx}
                    onMove={onMove}
                    type="property"
                    dragDisabled={!editMode}
                    render={(isDragable: boolean, ref) => (
                        <Grid item xs={6} md={4} xl={4}>
                            <ThingContext.Provider value={thing} key={property._id}>
                                <Paper
                                    ref={ref}
                                    sx={{
                                        padding: 1,
                                        sx: isDragable ? 0.4 : 1,
                                        userSelect: 'none',
                                        alignItems: 'center',
                                    }}
                                    className={clsx({ floating: editMode })}
                                >
                                    <PropertyRow
                                        property={property}
                                        state={thing.state?.[property.propertyId]}
                                        title={`${thing.config.name} ${property.name}`}
                                        onChange={(value) => {
                                            updatePropertyState({
                                                deviceId: thing.deviceId,
                                                nodeId: thing.config.nodeId,
                                                thingId: thing._id,
                                                propertyId: property.propertyId,
                                                value,
                                            });
                                        }}
                                    />
                                </Paper>
                            </ThingContext.Provider>
                        </Grid>
                    )}
                />
            ))}
        </>
    );
}

export default function UserDashboard() {
    const [searchParams] = useSearchParams();
    const editMode = searchParams.has('edit');
    const [openAddDialog, setOpenDialogOpen] = useState(false);
    const { isLoading } = useDevicesAllQuery();
    const dispatch = useAppDispatch();
    const { setAppHeader, resetAppHeader } = useAppBarContext();
    const navigate = useNavigate();

    const onMove = useCallback(
        (dragId: string, hoverId: string) => {
            dispatch(propertyPreferencesReducerActions.swapOrderFor([dragId, hoverId]));
        },
        [dispatch]
    );

    const prepareEditMode = useCallback(() => {
        dispatch(propertyPreferencesReducerActions.resetOrder());
    }, [dispatch]);

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
        } else {
            setAppHeader('Dashboard');
        }
    }, [editMode, navigate, prepareEditMode]);

    if (isLoading) return <CircularProgress />;

    function onChange({ target: { value } }: PropertySelectEvent) {
        dispatch(
            propertyPreferencesReducerActions.setOne({
                _id: value.propertyId,
                thingId: value.thingId,
                order: Number.MAX_SAFE_INTEGER,
            })
        );
        setOpenDialogOpen(false);
    }

    return (
        <>
            <DraggableProvider disabled={!editMode}>
                <Grid container spacing={2} p={2}>
                    <Properties editMode={editMode} onMove={onMove} />
                    <Grid item>
                        <IconButton onClick={() => setOpenDialogOpen(true)}>
                            <AddIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </DraggableProvider>
            <Dialog open={openAddDialog} fullWidth onClose={() => setOpenDialogOpen(false)}>
                <PropertySelect onChange={onChange} sx={{ maxHeight: 400 }} />
            </Dialog>
        </>
    );
}
