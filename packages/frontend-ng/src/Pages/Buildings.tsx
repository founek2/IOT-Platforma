import DoneIcon from '@mui/icons-material/Done';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import clsx from 'clsx';
import { logger } from 'common/src/logger';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Background } from '../components/Background';
import { ContextMenu } from '../components/ContextMenu';
import { Draggable, DraggableProvider } from '../components/Draggable';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useAppBarContext } from '../hooks/useAppBarContext';
import { useEditMode } from '../hooks/useEditMode';
import { Buildings, buildingsCachedSelector } from '../selectors/devicesSelector';
import { useDevicesQuery } from '../services/devices';
import { locationPreferencesReducerActions } from '../store/slices/preferences/locationSlice';
import { byPreferences } from '../utils/sort';
import { BuildingWidget } from './buildings/BuildingWidget';
import { EditModeDialog } from './buildings/EditModeDialog';

interface DevicesContentProps {
    buildingsData: Buildings;
    editMode?: 'rooms' | 'buildings';
    editEnabled: boolean;
    onMove: (dragId: string, hoverId: string) => any;
}
function DevicesContent({ buildingsData, editMode, onMove, editEnabled }: DevicesContentProps) {
    const locationPreferences = useAppSelector((state) => state.preferences.locations.entities);

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

type EditMode = false | 'rooms' | 'buildings';
const HOUR_1 = 60 * 60 * 1000;
export default function Devices() {
    const dispatch = useAppDispatch();
    const { setAppHeader, resetAppHeader } = useAppBarContext();
    const locationPreferences = useAppSelector((state) => state.preferences.locations.entities);
    const _ = useDevicesQuery(undefined, { pollingInterval: HOUR_1 });
    const { isEditMode, enterEditMode, leaveEditMode } = useEditMode();
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

    function handleSelectEditMode(mode: 'buildings' | 'rooms') {
        setEditMode(mode);
        prepareEditMode(mode);
    }

    const content = (
        <>
            <ContextMenu
                disabled={isEditMode && !!editMode}
                renderMenuItems={(onClose) => [
                    <MenuItem
                        key={0}
                        onClick={() => {
                            onClose();
                            enterEditMode();
                            setEditMode('rooms');
                        }}
                    >
                        Uspořádat místnosti
                    </MenuItem>,
                    <MenuItem
                        key={1}
                        onClick={() => {
                            onClose();
                            enterEditMode();
                            setEditMode('buildings');
                        }}
                    >
                        Uspořádat budovy
                    </MenuItem>,
                ]}
                render={({ onContextMenu, menuList }) => (
                    <Background onContextMenu={onContextMenu}>
                        <DevicesContent
                            buildingsData={data}
                            editEnabled={isEditMode}
                            editMode={editMode}
                            onMove={onMove}
                        />
                        {menuList}
                    </Background>
                )}
            />
            <EditModeDialog
                open={isEditMode && !editMode}
                onClose={(v) => (v ? handleSelectEditMode(v) : leaveEditMode())}
            />
        </>
    );

    if (editMode) return <DraggableProvider>{content}</DraggableProvider>;
    return content;
}
