import { logger } from "common/src/logger";
import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from ".";
import { useVapidKeyQuery } from "../endpoints/config";
import { useSubscribeToNotificationMutation } from "../endpoints/subscription";
import { getCurrentUserId } from "../selectors/getters";
import { urlBase64ToUint8Array } from "../utils/urlBase64ToUint8Array";

async function registerNotificationWorker(vapidKey: string, register: ServiceWorkerRegistration) {
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
    });

    return subscription
}

export function useWebPush(): [() => void, { permissionState?: PermissionState, unregister: () => Promise<void> }] {
    const [registration, setRegistration] = useState<ServiceWorkerRegistration>()
    const [permissionState, setPermissionState] = useState<PermissionState>()
    const { data: vapidKey } = useVapidKeyQuery(undefined);
    const [subscribeMutation] = useSubscribeToNotificationMutation()
    const userId = useAppSelector(getCurrentUserId)

    useEffect(() => {
        let mounted = true;
        async function run() {
            const swRegistration = await navigator.serviceWorker.getRegistration('/notification-worker.js')
            if (swRegistration && mounted) setRegistration(swRegistration)
        }
        run()

        return () => {
            mounted = false;
        }
    }, [])

    useEffect(() => {
        if (!registration) return;

        let mounted = true;
        async function run(register: ServiceWorkerRegistration) {
            const state = await register.pushManager.permissionState({ userVisibleOnly: true, applicationServerKey: vapidKey })
            console.log("State", state)
            if (mounted) setPermissionState(state)
        }
        run(registration)

        return () => {
            mounted = false;
        }
    }, [registration])

    const callback = useCallback(function () {
        if (!('serviceWorker' in navigator) || !vapidKey || !userId) return;

        async function run(vapidKey: string, userId: string, register: ServiceWorkerRegistration | undefined) {
            try {
                if (!register) {
                    register = await navigator.serviceWorker.register('/notification-worker.js', {
                        scope: '/'
                    });
                    const installingWorker = register.waiting;
                    installingWorker?.postMessage({ type: 'SKIP_WAITING' });
                    setRegistration(register)
                }
                const subscribe = await registerNotificationWorker(vapidKey, register)

                subscribeMutation({ userId, data: subscribe })
                    .unwrap()
                    .then(() => setPermissionState("granted"))
                    .catch((err) => logger.error("Failed to add subscription", err))
            } catch (err) {
                setPermissionState("denied")
                logger.error("failed to subscribe", err)
            }
        }
        run(vapidKey, userId, registration)
    }, [vapidKey, userId, registration])

    async function unregister() {
        if (registration) await registration.unregister()
        setPermissionState("prompt")
        setRegistration(undefined)
    }

    return [callback, { permissionState: permissionState, unregister }]
}