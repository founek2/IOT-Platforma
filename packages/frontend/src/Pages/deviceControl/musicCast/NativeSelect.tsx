import { Typography, Select } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles, Theme } from '@material-ui/core/styles'
import React, { Fragment, useRef } from 'react'
import { MusicCastInputs } from "common/lib/constants"
import clsx from "clsx"
import InputIcon from '@material-ui/icons/Input';

const useStyles = makeStyles((theme: Theme) => {
    return ({
        select: {
            width: "100%",
            paddingBottom: 0,
            paddingTop: 0,
            height: 52,
        },
        selectRoot: {
            position: 'absolute',
            left: 0,
            top: 0,
        },
        wrapperOver: {
            position: "relative",
            width: 60,
        },
        inputIcon: {
            marginTop: 12,
            width: "100%",
            color: theme.palette.action.active
        },
        disabledColor: {
            color: theme.palette.action.disabled
        }
    })
})

interface IconSelectProps {
    children: JSX.Element | JSX.Element[],
    value: any,
    disabled: boolean,
}

export function NativeSelect({ children, value, disabled }: IconSelectProps) {
    const classes = useStyles()

    return <div className={classes.wrapperOver}>
        <InputIcon
            fontSize="large"
            className={clsx(classes.inputIcon, disabled && classes.disabledColor)} />
        <Select
            value={value}
            className={classes.selectRoot}
            IconComponent={() => null}
            disableUnderline={true}
            classes={{
                select: classes.select
            }}
            disabled={disabled}
        >
            {children}
        </Select>
    </div>
}