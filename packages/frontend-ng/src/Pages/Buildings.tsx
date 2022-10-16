import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import { logger } from 'common/src/logger';
import React, { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';
import { Background } from '../components/Background';
import { ContextMenu } from '../components/ContextMenu';
import { Draggable } from '../components/Draggable';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useDevicesQuery } from '../services/devices';
import { locationPreferencesReducerActions } from '../store/slices/preferences/locationSlice';
import { byPreferences } from '../utils/sort';
import { BuildingWidget } from './buildings/BuildingWidget';
import { Buildings, buildingsCachedSelector } from '../selectors/devicesSelector';
import clsx from 'clsx';
import { not } from '../utils/ramda';

interface DevicesContentProps {
    buildingsData: Buildings;
    editMode: false | 'rooms' | 'buildings';
    onMove: (dragId: string, hoverId: string) => any;
}
function DevicesContent({ buildingsData, editMode, onMove }: DevicesContentProps) {
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
                        dragDisabled={not(editMode === 'buildings')}
                        render={(isDragable: boolean, ref) => (
                            <BuildingWidget
                                building={building}
                                isDragable={isDragable}
                                ref={ref}
                                editMode={editMode}
                                onMove={onMove}
                                isSingle={buildingsData.length === 1}
                                className={clsx({ floating: editMode === 'buildings' })}
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
    const locationPreferences = useAppSelector((state) => state.preferences.locations.entities);
    const [editMode, setEditMode] = useState<EditMode>(false);
    const _ = useDevicesQuery(undefined, { pollingInterval: HOUR_1 });

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

    function handleEditMode(onClose: () => any, newState: false | 'rooms' | 'buildings') {
        return () => {
            onClose();
            const mode = editMode ? false : newState;
            setEditMode(mode);
            if (mode === false) return;

            // reset order to correspond with displayed
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
        };
    }
    const menuItems = [
        editMode ? { text: 'Hotovo', mode: false as EditMode } : null,
        !editMode ? { text: 'Uspořádat místnosti', mode: 'rooms' as EditMode } : null,
        !editMode ? { text: 'Uspořádat budovy', mode: 'buildings' as EditMode } : null,
    ];
    const content = (
        <ContextMenu
            renderMenuItems={(onClose) =>
                menuItems.map(
                    (menuItem, idx) =>
                        menuItem && (
                            <MenuItem key={idx} onClick={handleEditMode(onClose, menuItem.mode)}>
                                {menuItem.text}
                            </MenuItem>
                        )
                )
            }
            render={({ onContextMenu, menuList }) => (
                <Background onContextMenu={onContextMenu}>
                    <DevicesContent buildingsData={data} editMode={editMode} onMove={onMove} />
                    {menuList}
                </Background>
            )}
        />
    );

    if (editMode) return <DndProvider backend={HTML5Backend}>{content}</DndProvider>;
    return content;
}
