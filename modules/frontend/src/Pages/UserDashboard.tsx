import { Button, Card, CardContent, CardHeader, CircularProgress, Grid, IconButton, Paper } from '@mui/material';
import clsx from 'clsx';
import { notEmpty } from 'common/src/utils/notEmpty';
import React, { useCallback, useEffect, useState } from 'react';
import DataList from '../components/DataList';
import { Draggable, DraggableProvider } from '../components/Draggable';
import PlotifyGauge from '../components/PlotifyGauge';
import { BrokerConnectionItem, BrokerData, ConnectionType, ItemExtended, useBrokerQuery } from '../endpoints/broker';
import { useDevicesAllQuery, useDevicesQuery } from '../endpoints/devices';
import { useAppDispatch, useAppSelector } from '../hooks';
import { ThingContext } from '../hooks/useThing';
import dashboardSlice, {
    PropertyPreferences,
    propertyPreferencesReducerActions,
} from '../store/slices/preferences/dashboardSlice';
import { thingPreferencesSelectors } from '../store/slices/preferences/thingSlice';
import { byPreferences } from '../utils/sort';
import PropertyRow from './room/PropertyRow';
import AddIcon from '@mui/icons-material/Add';
import { Dialog } from '../components/Dialog';
import PropertySelect, { PropertySelectEvent } from '../components/PropertySelect';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppBarContext } from '../hooks/useAppBarContext';
import DoneIcon from '@mui/icons-material/Done';

function Properties({ editMode, onMove }: { editMode: boolean; onMove: (dragId: string, hoverId: string) => any }) {
    const preferences = useAppSelector((state) => state.preferences.dashboard.entities);
    const thingsEntities = useAppSelector((state) => state.application.things.entities);

    const config = Object.values(preferences) as PropertyPreferences[];
    const things = config.map((c) => thingsEntities[c.thingId]).filter(notEmpty);

    const properties = things.flatMap((thing) => {
        const properties = thing.config.properties.filter((property) => preferences[property._id!]).filter(notEmpty);
        return properties.map((property) => ({ thing, property }));
    });

    return (
        <>
            {properties
                .map((t) => ({ ...t, id: t.property._id! }))
                .sort(byPreferences(preferences))
                .map(({ property, thing }, idx) => (
                    <Draggable
                        id={property._id!}
                        key={property._id!}
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
                                            // display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        className={clsx({ floating: editMode })}
                                    >
                                        <PropertyRow
                                            property={property}
                                            state={thing.state?.[property.propertyId]}
                                            title={`${thing.config.name} ${property.name}`}
                                            onChange={(value) => {
                                                // mutateThingState({
                                                //     propertyId: property.propertyId,
                                                //     value,
                                                // });
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
            propertyPreferencesReducerActions.addOne({
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
