import { Select, MenuItem, Slider, Switch, TextField, Typography, Box, SxProps } from '@mui/material';
import {
    IThingProperty,
    IThingPropertyEnum,
    IThingPropertyNumeric,
    PropertyDataType,
} from 'common/src/models/interface/thing';
import { isNumericDataType } from 'common/src/utils/isNumericDataType';
import { format } from 'date-fns';
import UpdatedBefore from '../../components/UpdatedBefore';
import PlotifyBoolean from '../../components/PlotifyBoolean';
import PlotifyNumeric from '../../components/PlotifyNumeric';
import {
    convertBoolHistoryToGraphData,
    convertNumericHistoryToGraphData,
} from 'frontend/src/utils/convertHistoryToGraphData';
import React, { useCallback, useState } from 'react';
import { ActivatorButton } from '../../components/ActivatorButton';
import { CopyUrlContext } from './helpers/CopyUrl';
import { toogleSwitchVal } from './helpers/toogleSwitchVal';
import { onEnterRun } from 'common/src/utils/onEnter';
import { SensorIcons } from '../../constants/sensorIcons';
import { Measurement } from 'common/src/types';
import { Theme } from '@mui/system';
import ColorPicker from '../../components/ColorPicker';

interface PropertyRowComponentProps {
    value: string | number | undefined;
    property: IThingProperty;
    onChange: (newValue: string | number) => void;
}
function PropertyRowComponent({ value, property, onChange }: PropertyRowComponentProps) {
    const [stateValue, setStateValue] = useState(value); // TODO rozbije se při příchozí změně z websocketu (desync)

    if (property.settable) {
        if (property.dataType === PropertyDataType.enum) {
            const propertyEnum = property as IThingPropertyEnum;

            return propertyEnum.format.length === 1 ? (
                <CopyUrlContext propertyId={property.propertyId} value={value as string}>
                    <ActivatorButton onClick={() => onChange(propertyEnum.format[0])} />
                </CopyUrlContext>
            ) : (
                <CopyUrlContext propertyId={property.propertyId} value={value as string}>
                    <Select value={value || ''} onChange={(e) => onChange(e.target.value as string)} variant="standard">
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
            console.log(propertyNumeric);
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
                    />
                </CopyUrlContext>
            );
        }
        const isNum = isNumericDataType(property.dataType);
        return (
            // TODO debounce nějaký delší?
            <CopyUrlContext propertyId={property.propertyId} value={stateValue as string}>
                <TextField
                    value={isNum ? Number(stateValue) : stateValue}
                    type={isNum ? 'number' : 'text'}
                    onChange={(e) => setStateValue(isNum ? Number(e.target.value) : e.target.value)}
                    onKeyDown={onEnterRun((e: any) => {
                        const val = isNum ? Number(e.target.value) : e.target.value;
                        onChange(val);
                    })}
                />
            </CopyUrlContext>
        );
    }

    const val = value ? value : '[Chybí hodnota]';
    return (
        <CopyUrlContext propertyId={property.propertyId} value={stateValue as string}>
            <Typography component="span">{val}</Typography>
        </CopyUrlContext>
    );
}

export function PropertyRowPlain({ value, property, onChange }: PropertyRowComponentProps) {
    const { unitOfMeasurement } = property;

    return (
        <>
            <PropertyRowComponent value={value} property={property} onChange={onChange} />
            <Typography component="span" sx={{ paddingLeft: unitOfMeasurement ? '0.4em' : '0' }}>
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
    if (property.dataType === PropertyDataType.enum) {
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

    return null;
}

interface PropertyRowProps {
    property: IThingProperty;
    value?: number | string;
    timestamp?: Date;
    onChange: (newValue: string | number) => void;
    history?: Measurement[];
    defaultShowDetail?: boolean;
    sx?: SxProps<Theme>;
}

function PropertyRow({
    property,
    value,
    onChange,
    history,
    timestamp,
    defaultShowDetail = false,
    sx,
}: PropertyRowProps) {
    const [showDetail, setshowDetail] = useState(defaultShowDetail);
    const toogleDetail = useCallback(() => setshowDetail(!showDetail), [setshowDetail, showDetail]);

    const { propertyClass, name } = property;
    const Icon = propertyClass ? SensorIcons[propertyClass] : null;

    return (
        <Box sx={sx}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Icon ? <Icon onClick={toogleDetail} /> : null}
                <Typography component="span" onClick={toogleDetail} pr={2} sx={{ cursor: 'pointer' }}>
                    {name}
                </Typography>
                <PropertyRowPlain property={property} value={value} onChange={onChange} />
            </Box>
            {showDetail && timestamp ? (
                <UpdatedBefore gutterBottom time={timestamp} variant="body2" prefix="Aktualizováno před" />
            ) : null}
            {showDetail && history?.some((v) => v.propertyId === property.propertyId)
                ? showDetailVisualization(property, history)
                : null}
        </Box>
    );
}

export default PropertyRow;
