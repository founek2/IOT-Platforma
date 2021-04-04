import React, { lazy } from "react";
import { useSelector } from "react-redux";
import { getUserPresence } from "framework-ui/lib/utils/getters";
import { Typography } from "@material-ui/core";

const DeviceControlLazy = lazy(() => import('./DeviceControl'));

function Main() {
    const userPresence = useSelector(getUserPresence)

    if (userPresence) return <DeviceControlLazy />

    return <Typography>Pro využití všech funkcí se musíte nejprve přihlásit. </Typography>
}

export default Main;