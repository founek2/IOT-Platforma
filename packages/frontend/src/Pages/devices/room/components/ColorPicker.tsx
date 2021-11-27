import React, { useEffect, useState } from "react";
import { amber, blue, blueGrey, brown, cyan, deepOrange, deepPurple, green, grey, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal, yellow } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { InfoAlert } from "framework-ui/lib/Components/InfoAlert";
import { HuePicker, TwitterPicker } from 'react-color';

const COLORS = ["#FFFFFF", red[500], pink[500], purple[500],
    deepPurple[500], indigo[500], blue[500],
    lightBlue[500], cyan[500], teal[500],
    green[500], lightGreen[500], lime[500],
    yellow[500], amber[500], orange[500],
    deepOrange[500], brown[500], blueGrey[500], grey[500]]

const useStyles = makeStyles((theme) => ({
    // colorRectangle: {
    //     height: 30,
    //     borderRadius: 4
    // },
    colored: {
        height: 30,
        borderRadius: 4
    },
    colorWrapper: {
        width: 100
    },
    marginTop: {
        marginTop: 20
    },
    twitterPicker: {
        boxShadow: "none !important",
        margin: "0 auto",
        "& div": {
            padding: "0 !important"
        }
    }
}));

function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb: string) {
    const [r, g, b] = rgb.split(",").map(val => parseInt(val))
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

interface SwitchMyProps {
    onChange?: ((event: { target: { value: string } }) => void),
    value?: string
    disabled?: boolean,
}

let timeout: NodeJS.Timeout;

function ColorPicker({ value, disabled, onChange }: SwitchMyProps) {
    const classes = useStyles()
    const [pickedColor, setPickedColor] = useState<{ hex: string }>()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (value && !pickedColor) {
            try {
                setPickedColor({ hex: rgbToHex(value) })
            } catch (err) {

            }
        }
    }, [setPickedColor, value, pickedColor])

    return <div>
        <div className={classes.colorWrapper} >
            <div style={{ backgroundColor: pickedColor?.hex }} className={classes.colored} onClick={() => setOpen(true)} />
        </div>
        <InfoAlert
            title="Barva"
            open={open}
            onClose={() => setOpen(false)}
            closeText="Zavřít"
            content={
                <>
                    <TwitterPicker
                        className={classes.twitterPicker}
                        triangle="hide"
                        colors={
                            COLORS
                        }
                        width="180px"
                        color={pickedColor?.hex}
                        onChange={(color) => {
                            setPickedColor(color)
                            const { r, g, b } = color.rgb

                            if (onChange) onChange({ target: { value: `${r},${g},${b}` } })
                        }}
                    />
                    <HuePicker
                        className={classes.marginTop}
                        width="210px"
                        color={pickedColor?.hex}
                        onChange={(color) => {
                            setPickedColor(color)
                            const { r, g, b } = color.rgb

                            if (timeout) clearTimeout(timeout)
                            if (onChange) timeout = setTimeout(() => onChange({ target: { value: `${r},${g},${b}` } }), 300)
                        }}
                    />
                </>
            }
        />
    </div>
}

export default ColorPicker;