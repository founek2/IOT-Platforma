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
        let timeout: NodeJS.Timeout | undefined;

        function handleConnect() {
            if (timeout) {
                clearTimeout(timeout)
                timeout = undefined
            }
            if (!ref.current) return

            closeSnackbar(ref.current)
            ref.current = undefined
        }

        function handleDisconnect() {
            if (timeout) clearTimeout(timeout)

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

        socket?.on("connect", handleConnect)
        socket?.on("disconnect", handleDisconnect)

        return () => {
            if (timeout) clearTimeout(timeout)
            socket?.removeListener("connect", handleConnect)
            socket?.removeListener("disconnect", handleDisconnect)
        }
    }, [socket])

    return null
}