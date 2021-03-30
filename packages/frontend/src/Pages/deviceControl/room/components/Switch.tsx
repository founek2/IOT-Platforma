import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import React from "react";
import switchCss from "./switch/css";

const useStyles = makeStyles((theme) => ({
    ...switchCss(theme),
}));

interface SwitchMyProps {
    onClick?: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void),
    checked?: boolean,
    disabled?: boolean,
}
function SwitchMy({ checked, disabled, onClick }: SwitchMyProps) {
    const classes = useStyles()
    return <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
            root: classes.switchRoot,
            switchBase: classes.switchBase,
            thumb: classes.thumb,
            track: classes.track,
            checked: classes.checked,
            disabled: classes.disabled,
        }}
        disabled={disabled}
        onClick={onClick}
        checked={checked}
    />
}

export default SwitchMy;