import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {
    IThingProperty,
    IThingPropertyEnum,
    IThingPropertyNumeric,
    PropertyDataType,
} from 'common/lib/models/interface/thing';
import { isNumericDataType } from 'common/lib/utils/isNumericDataType';
import { onEnterRun } from 'framework-ui/lib/utils/onEnter';
import { SensorIcons } from 'frontend/src/components/SensorIcons';
import React, { useState } from 'react';
import SwitchMy from './Switch';
import { CopyUrlContext } from './helpers/CopyUrl';
import { toogleSwitchVal } from './helpers/toogleSwitchVal';
import ColorPicker from './ColorPicker';
import { RootState } from 'frontend/src/store/store';
import PlotifyBoolean from 'frontend/src/components/PlotifyBoolean';
import PlotifyNumeric from 'frontend/src/components/PlotifyNumeric';
import {
    convertNumericHistoryToGraphData,
    convertBoolHistoryToGraphData,
} from 'frontend/src/utils/convertHistoryToGraphData';
import UpdatedBefore from 'framework-ui/lib/Components/UpdatedBefore';
import { HistoricalGeneric } from 'common/lib/models/interface/history';
import { useCallback } from 'react';
import { format } from 'date-fns';

const useStyles = makeStyles({
    root: {
        marginBottom: '0.5em',
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
    },
    icon: {
        fontSize: 25,
        marginRight: 5,
        cursor: 'pointer',
    },
    name: {
        paddingRight: '1em',
        cursor: 'pointer',
    },
    units: {
        paddingLeft: '0.25em',
    },
    slider: {
        width: '40%',
    },
    updatedBefore: {
        textAlign: 'center',
        padding: '0.2em',
    },
});

function ValueComponent({
    value,
    property,
    onChange,
}: {
    value: string | number | undefined;
    property: IThingProperty;
    onChange: (newValue: string | number) => void;
}) {
    const classes = useStyles();
    const [stateValue, setStateValue] = useState(value); // TODO rozbije se při příchozí změně z websocketu (desync)

    if (property.settable) {
        if (property.dataType === PropertyDataType.enum) {
            return (
                <CopyUrlContext propertyId={property.propertyId} value={value as string}>
                    <Select value={value || ''} onChange={(e) => onChange(e.target.value as string)} disableUnderline>
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
                <CopyUrlContext propertyId={property.propertyId} value={value as number} className={classes.slider}>
                    <Slider
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
                    <SwitchMy
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
    return <Typography component="span">{val} </Typography>;
}

function showDetailVisualization(
    property: IThingProperty,
    historyData: RootState['application']['thingHistory']['data']
) {
    if (isNumericDataType(property.dataType))
        return <PlotifyNumeric data={[convertNumericHistoryToGraphData(historyData, property.propertyId)]} />;
    if (property.dataType === PropertyDataType.boolean)
        return (
            <PlotifyBoolean
                data={[
                    convertBoolHistoryToGraphData(historyData as unknown as HistoricalGeneric[], property.propertyId),
                ]}
            />
        );
    if (property.dataType === PropertyDataType.enum) {
        const data = convertNumericHistoryToGraphData(historyData, property.propertyId);
        return (
            <div style={{ textAlign: 'center' }}>
                {data.x.slice(-3).map((date, i) => {
                    return (
                        <Typography>
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
    history?: RootState['application']['thingHistory'];
    defaultShowDetail?: boolean;
}

function PropertyRow({ property, value, onChange, history, timestamp, defaultShowDetail = false }: PropertyRowProps) {
    const classes = useStyles();
    const [showDetail, setshowDetail] = useState(defaultShowDetail);
    const toogleDetail = useCallback(() => setshowDetail(!showDetail), [setshowDetail, showDetail]);

    const { unitOfMeasurement, propertyClass, name } = property;
    const Icon = propertyClass ? SensorIcons[propertyClass] : null;
    const units = unitOfMeasurement ? ' ' + unitOfMeasurement : '';

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                {Icon ? <Icon className={classes.icon} onClick={toogleDetail} /> : null}
                <Typography component="span" className={classes.name} onClick={toogleDetail}>
                    {name}
                </Typography>
                <ValueComponent property={property} value={value} onChange={onChange} />
                <Typography className={classes.units}>{units}</Typography>
            </div>
            {showDetail && timestamp ? (
                <UpdatedBefore
                    gutterBottom
                    time={new Date(timestamp)}
                    variant="body2"
                    prefix="Aktualizováno před"
                    className={classes.updatedBefore}
                />
            ) : null}
            {showDetail && history && history ? showDetailVisualization(property, history.data) : null}
        </div>
    );
}

export default PropertyRow;
