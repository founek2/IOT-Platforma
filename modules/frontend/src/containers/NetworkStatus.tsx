import React, { useEffect, useRef, useState } from "react"
import ErrorMessages from "common/src/localization/error";
import { SnackbarKey, useSnackbar } from "notistack";
import { Socket } from "socket.io-client"

interface NetworkStatusProps {
    socket?: Socket
}
export default function NetworkStatus({ socket }: NetworkStatusProps) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const ref = useRef<SnackbarKey>();

    useEffect(() => {
        function handleConnect() {
            if (!ref.current) return

            closeSnackbar(ref.current)
            ref.current = undefined
        }

        let timeout: NodeJS.Timeout | undefined;
        function handleDisconnect() {
            timeout = setTimeout(() => {
                const snackbarKey = enqueueSnackbar(ErrorMessages.getMessage("offlineMode"), { persist: true })
                ref.current = snackbarKey
            }, 800)
        }

        if (!socket?.connected && !ref.current) {
            handleDisconnect()
        }

        if (socket?.connected && ref.current) {
            handleConnect()
        }

        console.log("socket", socket)

        socket?.on("connect", handleConnect)
        socket?.on("disconnect", handleDisconnect)

        return () => {
            clearTimeout(timeout)
            socket?.removeListener("connect", handleConnect)
            socket?.removeListener("disconnect", handleDisconnect)
        }
    }, [socket])

    return null
}