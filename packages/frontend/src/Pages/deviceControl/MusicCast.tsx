import { Typography, Select } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles, Theme } from '@material-ui/core/styles'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'
import React, { Fragment, useRef } from 'react'
import boxHoc from './components/boxHoc'
import ControlContextMenu from './components/ControlContextMenu'
import InputIcon from '@material-ui/icons/Input';
import { MusicCastInputs } from "common/lib/constants"

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        paddingBottom: 5,
        width: 60
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center'
    },
    header: {
        height: '1.7em',
        overflow: 'hidden',
        userSelect: 'none'
    },
    circle: {
        top: 3,
        right: 3,
        position: 'absolute'
    },
    select: {
        width: "100%",
        paddingBottom: 0,
        paddingTop: 0,

        height: 52
        // paddingTop: 12
    },
    selectRoot: {
        position: 'absolute',
        left: 0,
        top: 0,
    },
    wrapper: {
        display: "flex",
        marginTop: 3,
    },
    wrapperOver: {
        position: "relative"
    },
    inputIcon: {
        marginTop: 12,
        width: "100%",
        color: "rgba(0, 0, 0, 0.54)"
    }
}))

function RgbSwitch({ name, description, onClick, data, ackTime, afk, pending, forceUpdate, JSONkey, id, ...props }: any) {
    const classes = useStyles()
    const selectEl = useRef<null | HTMLSelectElement>(null);
    const isDisabled = afk || pending

    function handleSelectChange(e: React.ChangeEvent<{ value: any }>) {
        onClick({
            input: e.target.value
        })
    }

    return (
        <ControlContextMenu
            name={name}
            id={id}
            JSONkey={JSONkey}
            render={({ handleOpen }: any) => {
                return (
                    <div className={classes.root}>
                        <Typography className={classes.header} onContextMenu={handleOpen}>
                            {name}
                        </Typography>
                        <div className={classes.wrapper}>
                            <IconButton aria-label="delete" className={classes.button} disabled={isDisabled} onClick={() => onClick({ on: 1 })}>
                                <PowerSettingsNewIcon fontSize="large" />
                            </IconButton>

                            <div className={classes.wrapperOver}>
                                <InputIcon fontSize="large" className={classes.inputIcon} />
                                <Select
                                    native
                                    value=""
                                    disabled={isDisabled}
                                    onChange={handleSelectChange}
                                    className={classes.selectRoot}
                                    IconComponent={() => null}
                                    ref={selectEl}
                                    disableUnderline={true}
                                    classes={{
                                        select: classes.select
                                    }}
                                >
                                    <option value="" />
                                    {MusicCastInputs.map(({ label, value }) => <option value={value} key={value}>{label}</option>)}
                                </Select>

                            </div>
                        </div>
                    </div>
                );
            }}
        />
    )
}

const component = RgbSwitch

export default boxHoc(component)