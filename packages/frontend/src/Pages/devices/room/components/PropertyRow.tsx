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
import ColorPicker from "./ColorPicker"

const useStyles = makeStyles({
    container: {
        fontSize: 25,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '0.5em',
    },
    icon: {
        marginRight: 5,
    },
    name: {
        paddingRight: '1em',
    },
    units: {
        paddingLeft: '0.25em',
    },
    slider: {
        width: '40%',
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
                    <Select
                        value={value}
                        onChange={(e) => {
                            onChange(e.target.value as string);
                        }}
                        disableUnderline
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
    return <Typography component="span">{val}</Typography>;
}

interface PropertyRowProps {
    property: IThingProperty;
    value?: number | string;
    onChange: (newValue: string | number) => void;
}

function PropertyRow({ property, value, onChange }: PropertyRowProps) {
    const classes = useStyles();
    const { unitOfMeasurement, propertyClass, name } = property;
    const Icon = propertyClass ? SensorIcons[propertyClass] : null;

    const units = unitOfMeasurement ? ' ' + unitOfMeasurement : '';

    return (
        <div className={classes.container}>
            {Icon ? <Icon className={classes.icon} /> : null}
            <Typography component="span" className={classes.name}>
                {name}
            </Typography>
            <ValueComponent property={property} value={value} onChange={onChange} />
            <Typography className={classes.units}>{units}</Typography>
        </div>
    );
}

export default PropertyRow;
