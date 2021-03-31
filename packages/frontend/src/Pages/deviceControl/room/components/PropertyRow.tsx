import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    IThingProperty,
    PropertyDataType,
    IThingPropertyEnum,
    IThingPropertyNumeric,
} from "common/lib/models/interface/thing";
import { SensorIcons } from "frontend/src/components/SensorIcons";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Slider from "@material-ui/core/Slider";
import { isNumericDataType } from "common/lib/utils/isNumericDataType";
import TextField from "@material-ui/core/TextField";
import { onEnterRun } from "framework-ui/lib/utils/onEnter";
import SwitchMy from "./Switch";

const useStyles = makeStyles({
    container: {
        fontSize: 25,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "0.5em",
    },
    icon: {
        marginRight: 5,
    },
    name: {
        paddingRight: "1em",
    },
    units: {
        paddingLeft: "0.25em",
    },
    slider: {
        width: "40%",
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
    const [stateValue, setStateValue] = useState(value);    // TODO rozbije se při příchozí změně z websocketu (desync)

    if (property.settable) {
        if (property.dataType === PropertyDataType.enum) {
            return (
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
            );
        } else if (isNumericDataType(property.dataType) && (property as IThingPropertyNumeric).format) {
            const propertyNumeric = property as IThingPropertyNumeric;
            return (    // TODO debounce bude lepší
                <Slider
                    className={classes.slider}
                    onChangeCommitted={(e, newValue) => onChange(newValue as number)}
                    value={stateValue !== undefined ? Number(stateValue) : propertyNumeric.format?.min}
                    onChange={(e, newValue) => setStateValue(newValue as number)}
                    min={propertyNumeric.format?.min}
                    max={propertyNumeric.format?.max}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                />
            );
        } else if (property.dataType === PropertyDataType.boolean) {
            return (
                <SwitchMy
                    onClick={() => {
                        onChange(value === "true" ? "false" : "true")
                    }}
                    checked={value === "true"}
                />
            );
        }
        const isNum = isNumericDataType(property.dataType);
        return (    // TODO debounce nějaký delší?
            <TextField
                value={isNum ? Number(stateValue) : stateValue}
                type={isNum ? "number" : "text"}
                onChange={(e) => setStateValue(isNum ? Number(e.target.value) : e.target.value)}
                onKeyDown={onEnterRun((e: any) => {
                    const val = isNum ? Number(e.target.value) : e.target.value;
                    onChange(val);
                })}
            />
        );
    }
    const val = value ? value : "[Chybí hodnota]";
    return <Typography component="span">{val}</Typography>;
}

interface PropertyRowProps {
    property: IThingProperty;
    value?: number | string;
    onChange: (newValue: string | number) => void;
}

function PropertyRow({ property, value, onChange }: PropertyRowProps) {
    const classes = useStyles();
    const { unitOfMeasurement, propertyId, propertyClass, name, settable } = property;
    const Icon = propertyClass ? SensorIcons[propertyClass] : null;

    const units = unitOfMeasurement ? " " + unitOfMeasurement : "";

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
