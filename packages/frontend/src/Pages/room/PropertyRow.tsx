import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CardMedia, Fade, SxProps } from '@mui/material';
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
import { convertBoolHistoryToGraphData, convertNumericHistoryToGraphData } from '../../utils/convertHistoryToGraphData';
import React, { forwardRef, useCallback, useState } from 'react';
import { ActivatorButton } from '../../components/ActivatorButton';
import { CopyUrlContext } from './helpers/CopyUrl';
import { toogleSwitchVal } from './helpers/toogleSwitchVal';
import { onEnterRun } from 'common/src/utils/onEnter';
import { SensorIcons } from '../../constants/sensorIcons';
import { Measurement } from 'common/src/types';
import type { Theme } from '@mui/material';
import ColorPicker from '../../components/ColorPicker';
import { PropertyState } from '../../store/slices/application/thingsSlice';
import { CircleComponent } from '../../components/OnlineCircle';
import { CircleColors } from '../../utils/getCircleColor';
import { VideoStream } from '../../components/VideoStream';
import { isUrl } from "common/src/utils/isUrl"

interface PropertyRowComponentProps {
    state?: PropertyState;
    property: IThingProperty;
    onChange: (newValue: string | number) => void;
    disabled?: boolean;
}
function PropertyRowComponent({ state, property, onChange, disabled: disabledOverride }: PropertyRowComponentProps) {
    const value = state?.value;
    const [stateValue, setStateValue] = useState(value); // TODO rozbije se při příchozí změně z websocketu (desync)
    const disabled = disabledOverride || !property.settable;

    let component: JSX.Element;

    if (property.dataType === PropertyDataType.enum) {
        const propertyEnum = property as IThingPropertyEnum;

        component = propertyEnum.format.length === 1 ? (
            <ActivatorButton onClick={() => onChange(propertyEnum.format[0])} disabled={disabled} />
        ) : (
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
        );
    } else if (isNumericDataType(property.dataType) && (property as IThingPropertyNumeric).format) {
        const propertyNumeric = property as IThingPropertyNumeric;
        component = (
            // TODO debounce bude lepší
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
        );
    } else if (property.dataType === PropertyDataType.boolean) {
        component = (
            <Switch
                onClick={() => {
                    onChange(toogleSwitchVal(value));
                }}
                checked={value === 'true'}
                disabled={disabled}
            />
        );
    } else if (property.dataType === PropertyDataType.binary && property.format?.startsWith("image/") && typeof value === "string") {
        component = <CardMedia component="img" src={`data:${property.format};base64,` + value} />
    } else if (property.dataType === PropertyDataType.color) {
        component = <ColorPicker
            value={value as string}
            onChange={(e) => {
                onChange(e.target.value);
            }}
            disabled={disabled}
        />
    } else if (property.dataType === PropertyDataType.string && property.format?.startsWith("image/") && isUrl(value)) {
        component = <CardMedia component="img" src={value as string} />
    } else if (property.dataType === PropertyDataType.string && property.format?.startsWith("video/") && isUrl(value)) {
        component = <VideoStream src={value as string} />
    } else if (property.settable) {
        const isNum = isNumericDataType(property.dataType);
        component = (
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
        );
    }
    else {
        component = (
            <Typography component="span" sx={disabledOverride ? { opacity: 0.6 } : undefined}>
                {value === undefined ? "-" : value}
            </Typography>
        );
    }
    return <Box sx={{ position: "relative" }}>
        <CopyUrlContext propertyId={property.propertyId} value={value as string}>
            {component}
        </CopyUrlContext>
        <Fade in={state?.inTransition} timeout={{ enter: 1500, exit: 500 }}>
            <CircleComponent color={CircleColors.Orange} title="Čeká se na potvrzení" sx={{
                position: "absolute", right: -24, top: 0, bottom: 0,
                margin: "auto"
            }} />
        </Fade>
    </Box>
}

export function PropertyRowPlain({ state, property, onChange, disabled }: PropertyRowComponentProps) {
    const { unitOfMeasurement } = property;

    return (
        <>
            <PropertyRowComponent state={state} property={property} onChange={onChange} disabled={disabled} />
            {unitOfMeasurement ?
                <Typography
                    component="span"
                    sx={{ paddingLeft: unitOfMeasurement ? '0.4em' : '0', opacity: disabled ? 0.6 : 1 }}
                >
                    {unitOfMeasurement}
                </Typography> : null}
        </>
    );
}

function DetailVisualization({ property, historyData }: { property: IThingProperty, historyData: Measurement[] }) {
    const [selected, setSelected] = useState<number>()

    if (isNumericDataType(property.dataType))
        return <PlotifyNumeric data={[convertNumericHistoryToGraphData(historyData, property.propertyId)]} />;
    if (property.dataType === PropertyDataType.boolean)
        return <PlotifyBoolean data={[convertBoolHistoryToGraphData(historyData, property.propertyId)]} />;

    const data = convertNumericHistoryToGraphData(historyData, property.propertyId);
    return (
        <Box textAlign="center" display="flex" alignItems="center" flexDirection="column" gap={1} >
            {
                data.x
                    .slice(-3)
                    .reverse()
                    .map((date, i) => {
                        const value = data.y[i];
                        if (property.dataType === PropertyDataType.string && property.format?.startsWith("video/") && isUrl(value))
                            return null

                        if (property.dataType === PropertyDataType.binary && property.format?.startsWith("image/"))
                            return <Box key={date.getTime()} display="flex" flexDirection="row" gap={2} onClick={() => setSelected(selected === i ? undefined : i)}>
                                <Typography >
                                    {format(date, 'd. L. HH:mm')}
                                </Typography>
                                <CardMedia component="img" src={`data:${property.format};base64,` + value} sx={{ maxWidth: selected === i ? "none" : 50 }} />
                            </Box>

                        return (
                            <Typography key={date.getTime()}>
                                {format(date, 'd. L. HH:mm')} - {value}
                            </Typography>
                        );
                    })
            }
        </Box >
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
    className?: string;
}

const PropertyRow = forwardRef<HTMLDivElement, PropertyRowProps>(function PropertyRow({ property, state, onChange, history, defaultShowDetail = false, sx, className }, ref) {
    const [showDetail, setshowDetail] = useState(defaultShowDetail);
    const toogleDetail = useCallback(() => setshowDetail(!showDetail), [setshowDetail, showDetail]);

    const { propertyClass, name } = property;
    const Icon = propertyClass ? SensorIcons[propertyClass] : null;
    // console.log('state row', state?.desiredValue);
    return (
        <Box sx={sx} ref={ref} className={className}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Icon ? <Icon onClick={toogleDetail} /> : null}
                <Typography component="span" onClick={toogleDetail} pr={2} sx={{ cursor: 'pointer' }}>
                    {name}
                </Typography>
                <PropertyRowPlain property={property} state={state} onChange={onChange} />
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
                ? <DetailVisualization property={property} historyData={history} />
                : null}
        </Box>
    );
})

export default PropertyRow;
