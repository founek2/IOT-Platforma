import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import React from "react";
import switchCss from "./switch/css";
import { CirclePicker } from 'react-color'

const useStyles = makeStyles((theme) => ({
    // colorRectangle: {
    //     height: 30,
    //     borderRadius: 4
    // },
    colored: {
        height: 30,
        borderRadius: 4
    },
}));

interface SwitchMyProps {
    onChange?: ((event: { target: { value: string } }) => void),
    value?: string
    disabled?: boolean,
}
function ColorPicker({ value, disabled, onChange }: SwitchMyProps) {
    const classes = useStyles()
    return <div>
        <div >
            <div style={{ backgroundColor: value }} className={classes.colored} />
        </div>
        <CirclePicker
            color={value}
            onChange={({ rgb }) => onChange && onChange({ target: { value: `${rgb.r},${rgb.g},${rgb.b}` } })}
        />
    </div>
}

export default ColorPicker;