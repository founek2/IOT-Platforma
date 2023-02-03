import DoneIcon from '@mui/icons-material/Done';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import clsx from 'clsx';
import { logger } from 'common/src/logger';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Draggable, DraggableProvider } from '../components/Draggable';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useAppBarContext } from '../hooks/useAppBarContext';
import { useEditMode } from '../hooks/useEditMode';
import { Buildings, buildingsCachedSelector } from '../selectors/devicesSelector';
import { useDevicesQuery } from '../endpoints/devices';
import { locationPreferencesReducerActions } from '../store/slices/preferences/locationSlice';
import { byPreferences } from '../utils/sort';
import { BuildingWidget } from './locations/BuildingWidget';
import { EditModeDialog } from './locations/EditModeDialog';

interface DevicesContentProps {
    buildingsData: Buildings;
    editMode?: 'rooms' | 'buildings';
    editEnabled: boolean;
    onMove: (dragId: string, hoverId: string) => any;
}
function DevicesContent({ buildingsData, editMode, onMove, editEnabled }: DevicesContentProps) {
    const locationPreferences = useAppSelector((state) => state.preferences.locations.entities);
    console.log(editEnabled, editMode);
    return (
        <Grid container justifyContent="center">
            {buildingsData.sort(byPreferences(locationPreferences)).map((building, idx) => {
                return (
                    <Draggable
                        id={building.id}
                        key={building.id}
                        index={idx}
                        onMove={onMove}
                        type="building"
                        dragDisabled={!editEnabled || editMode !== 'buildings'}
                        render={(isDragable: boolean, ref) => (
                            <BuildingWidget
                                building={building}
                                isDragable={isDragable}
                                ref={ref}
                                editEnabled={editEnabled}
                                editMode={editMode}
                                onMove={onMove}
                                isSingle={buildingsData.length === 1}
                                className={clsx({ floating: editEnabled && editMode === 'buildings' })}
                            />
                        )}
                    />
                );
            })}
        </Grid>
    );
}

interface DevicesProps {
    title?: string;
}
export default function Locations({ title }: DevicesProps) {
    const dispatch = useAppDispatch();
    const { setAppHeader, resetAppHeader } = useAppBarContext();
    const locationPreferences = useAppSelector((state) => state.preferences.locations.entities);
    const { isLoading } = useDevicesQuery(undefined, { pollingInterval: 10 * 60 * 1000 });
    const { isEditMode, leaveEditMode } = useEditMode();
    const [editMode, setEditMode] = useState<'rooms' | 'buildings' | undefined>(undefined);

    const buildings = useAppSelector(buildingsCachedSelector);
    const { building: selectedBuilding } = useParams<{ building: string }>();
    logger.silly('Rendering Devices...');

    const selectedBuildingData = buildings.find((b) => b.name === selectedBuilding);
    const data = selectedBuildingData ? [selectedBuildingData] : buildings;

    const onMove = useCallback(
        (dragId: string, hoverId: string) => {
            dispatch(locationPreferencesReducerActions.swapOrderFor([dragId, hoverId]));
        },
        [dispatch]
    );

    const prepareEditMode = useCallback(
        (mode: 'rooms' | 'buildings') => {
            if (!data) return;

            if (mode === 'rooms')
                data.forEach((building) => {
                    dispatch(
                        locationPreferencesReducerActions.resetOrderFor(
                            building.rooms.sort(byPreferences(locationPreferences)).map((r) => r.id)
                        )
                    );
                });

            if (mode === 'buildings')
                dispatch(
                    locationPreferencesReducerActions.resetOrderFor(
                        data.sort(byPreferences(locationPreferences)).map((r) => r.id)
                    )
                );
        },
        [dispatch, data]
    );

    useEffect(() => {
        if (isEditMode)
            setAppHeader(
                'Editace',
                <IconButton
                    onClick={() => {
                        leaveEditMode();
                        setEditMode(undefined);
                    }}
                >
                    <DoneIcon />
                </IconButton>
            );
        else resetAppHeader();
    }, [isEditMode, leaveEditMode]);

    useEffect(() => {
        if (title) setAppHeader(title);
        return () => resetAppHeader();
    }, [title]);

    function handleSelectEditMode(mode: 'buildings' | 'rooms') {
        setEditMode(mode);
        prepareEditMode(mode);
    }

    const content = (
        <>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <DevicesContent buildingsData={data} editEnabled={isEditMode} editMode={editMode} onMove={onMove} />
            )}

            <EditModeDialog
                open={isEditMode && !editMode}
                onClose={(v) => (v ? handleSelectEditMode(v) : leaveEditMode())}
            />
        </>
    );

    if (editMode) return <DraggableProvider>{content}</DraggableProvider>;
    return content;
}
