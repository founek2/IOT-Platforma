import { MenuItem, Slider, Switch, Select, type SxProps, TextField, Typography, Box } from '@mui/material';
import {
    IThingProperty,
    IThingPropertyEnum,
    IThingPropertyNumeric,
    PropertyDataType,
} from 'common/src/models/interface/thing.js';
import { isNumericDataType } from 'common/src/utils/isNumericDataType.js';
import { format } from 'date-fns';
import UpdatedBefore from '../../components/UpdatedBefore.js';
import PlotifyBoolean from '../../components/PlotifyBoolean.js';
import PlotifyNumeric from '../../components/PlotifyNumeric.js';
import { convertBoolHistoryToGraphData, convertNumericHistoryToGraphData } from '../../utils/convertHistoryToGraphData.js';
import React, { useCallback, useState } from 'react';
import { ActivatorButton } from '../../components/ActivatorButton.js';
import { CopyUrlContext } from './helpers/CopyUrl.js';
import { toogleSwitchVal } from './helpers/toogleSwitchVal.js';
import { onEnterRun } from 'common/src/utils/onEnter.js';
import { SensorIcons } from '../../constants/sensorIcons.js';
import { Measurement } from 'common/src/types.js';
import type { Theme } from '@mui/material';
import ColorPicker from '../../components/ColorPicker.js';
import { PropertyState } from '../../store/slices/application/thingsSlice.js';

interface PropertyRowComponentProps {
    value: string | number | boolean | undefined;
    property: IThingProperty;
    onChange: (newValue: string | number) => void;
    disabled?: boolean;
}
function PropertyRowComponent({ value, property, onChange, disabled }: PropertyRowComponentProps) {
    const [stateValue, setStateValue] = useState(value); // TODO rozbije se při příchozí změně z websocketu (desync)

    if (property.settable) {
        if (property.dataType === PropertyDataType.enum) {
            const propertyEnum = property as IThingPropertyEnum;

            return propertyEnum.format.length === 1 ? (
                <CopyUrlContext propertyId={property.propertyId} value={value as string}>
                    <ActivatorButton onClick={() => onChange(propertyEnum.format[0])} disabled={disabled} />
                </CopyUrlContext>
            ) : (
                <CopyUrlContext propertyId={property.propertyId} value={value as string}>
                    <Select
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value as string)}
                        variant="standard"
                        disabled={disabled}
                    >
                        {(property as IThingPropertyEnum).format.map((label) => (
                            <MenuItem value={label} key={label}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </CopyUrlContext>
            );
        } else if (isNumericDataType(property.dataType) && (property as IThingPropertyNumeric).format) {
            const propertyNumeric = property as IThingPropertyNumeric;
            return (
                // TODO debounce bude lepší
                <CopyUrlContext propertyId={property.propertyId} value={value as number}>
                    <Slider
                        sx={{ width: '80px' }}
                        onChangeCommitted={(e, newValue) => onChange(newValue as number)}
                        value={stateValue !== undefined ? Number(stateValue) : propertyNumeric.format?.min}
                        onChange={(e, newValue) => setStateValue(newValue as number)}
                        min={propertyNumeric.format?.min}
                        max={propertyNumeric.format?.max}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        disabled={disabled}
                    />
                </CopyUrlContext>
            );
        } else if (property.dataType === PropertyDataType.boolean) {
            return (
                <CopyUrlContext propertyId={property.propertyId} value={value as string}>
                    <Switch
                        onClick={() => {
                            onChange(toogleSwitchVal(value));
                        }}
                        checked={value === 'true'}
                        disabled={disabled}
                    />
                </CopyUrlContext>
            );
        } else if (property.dataType === PropertyDataType.color) {
            return (
                <CopyUrlContext propertyId={property.propertyId} value={value as string}>
                    <ColorPicker
                        value={value as string}
                        onChange={(e) => {
                            onChange(e.target.value);
                        }}
                        disabled={disabled}
                    />
                </CopyUrlContext>
            );
        }
        const isNum = isNumericDataType(property.dataType);
        return (
            <CopyUrlContext propertyId={property.propertyId} value={stateValue as string}>
                <TextField
                    focused={stateValue ? String(stateValue) !== String(value) : undefined}
                    value={stateValue || ''}
                    inputProps={{ inputMode: isNum ? 'numeric' : "text", pattern: isNum ? '[0-9]*' : "" }}
                    onChange={(e) => setStateValue(isNum ? Number(e.target.value) : e.target.value)}
                    onKeyDown={onEnterRun((e: any) => {
                        const val = isNum ? Number(e.target.value) : e.target.value;
                        onChange(val);
                    })}
                    disabled={disabled}
                />
            </CopyUrlContext>
        );
    }

    const val = value === undefined ? '-' : value;
    return (
        <CopyUrlContext propertyId={property.propertyId} value={stateValue as string}>
            <Typography component="span" sx={disabled ? { opacity: 0.6 } : undefined}>
                {val}
            </Typography>
        </CopyUrlContext>
    );
}

export function PropertyRowPlain({ value, property, onChange, disabled }: PropertyRowComponentProps) {
    const { unitOfMeasurement } = property;

    return (
        <>
            <PropertyRowComponent value={value} property={property} onChange={onChange} disabled={disabled} />
            <Typography
                component="span"
                sx={{ paddingLeft: unitOfMeasurement ? '0.4em' : '0', opacity: disabled ? 0.6 : 1 }}
            >
                {unitOfMeasurement ? unitOfMeasurement : ''}
            </Typography>
        </>
    );
}

function showDetailVisualization(property: IThingProperty, historyData: Measurement[]) {
    if (isNumericDataType(property.dataType))
        return <PlotifyNumeric data={[convertNumericHistoryToGraphData(historyData, property.propertyId)]} />;
    if (property.dataType === PropertyDataType.boolean)
        return <PlotifyBoolean data={[convertBoolHistoryToGraphData(historyData, property.propertyId)]} />;

    const data = convertNumericHistoryToGraphData(historyData, property.propertyId);
    return (
        <div style={{ textAlign: 'center' }}>
            {data.x
                .slice(-3)
                .reverse()
                .map((date, i) => {
                    return (
                        <Typography key={date.getTime()}>
                            {format(date, 'd. L. HH:mm')} - {data.y[i]}
                        </Typography>
                    );
                })}
        </div>
    );
}

interface PropertyRowProps {
    property: IThingProperty;
    state?: PropertyState;
    timestamp?: Date;
    onChange: (newValue: string | number) => void;
    history?: Measurement[];
    defaultShowDetail?: boolean;
    sx?: SxProps<Theme>;
}

function PropertyRow({ property, state, onChange, history, defaultShowDetail = false, sx }: PropertyRowProps) {
    const [showDetail, setshowDetail] = useState(defaultShowDetail);
    const toogleDetail = useCallback(() => setshowDetail(!showDetail), [setshowDetail, showDetail]);

    const { propertyClass, name } = property;
    const Icon = propertyClass ? SensorIcons[propertyClass] : null;
    // console.log('state row', state?.desiredValue);
    return (
        <Box sx={sx}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Icon ? <Icon onClick={toogleDetail} /> : null}
                <Typography component="span" onClick={toogleDetail} pr={2} sx={{ cursor: 'pointer' }}>
                    {name}
                </Typography>
                <PropertyRowPlain property={property} value={state?.value} onChange={onChange} />
            </Box>
            {showDetail && state?.timestamp ? (
                <UpdatedBefore
                    gutterBottom
                    time={new Date(state.timestamp)}
                    variant="body2"
                    prefix="Aktualizováno před"
                />
            ) : null}
            {showDetail && history?.some((v) => v.propertyId === property.propertyId)
                ? showDetailVisualization(property, history)
                : null}
        </Box>
    );
}

export default PropertyRow;
