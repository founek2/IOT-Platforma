import ErrorMessages from "common/src/localization/error";
import { logger } from "common/src/logger";
import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from ".";
import { useVapidKeyQuery } from "../endpoints/config";
import { useSubscribeToNotificationMutation } from "../endpoints/subscription";
import { getCurrentUserId } from "../selectors/getters";
import { notificationActions } from "../store/slices/notificationSlice";
import { urlBase64ToUint8Array } from "../utils/urlBase64ToUint8Array";
import { useAsyncEffect } from "./useAsyncEffect";

async function subscribeNotificationWorker(vapidKey: string, register: ServiceWorkerRegistration) {
    return register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
    });
}

export function useWebPush(): [() => void, { permissionState?: PermissionState, unregister: () => Promise<void> }] {
    const [registration, setRegistration] = useState<ServiceWorkerRegistration>()
    const [permissionState, setPermissionState] = useState<PermissionState>()
    const { data: vapidKey } = useVapidKeyQuery(undefined);
    const [subscribeMutation] = useSubscribeToNotificationMutation()
    const userId = useAppSelector(getCurrentUserId)
    const dispatch = useAppDispatch();

    const subscribeAndSendSubscription = useCallback(async (worker: ServiceWorkerRegistration) => {
        if (!vapidKey || !userId) return;

        try {
            const subscription = await subscribeNotificationWorker(vapidKey, worker)
            subscribeMutation({ userId, data: subscription })
                .unwrap()
                .then(() => setPermissionState("granted"))
                .catch((err) => logger.error("Failed to add subscription", err))
        } catch (err) {
            dispatch(notificationActions.add({ message: ErrorMessages.getMessage("notificationsDisabled"), options: { variant: 'error' } }))
            setPermissionState("denied")
        }

    }, [vapidKey, userId, subscribeMutation, dispatch])

    useAsyncEffect(async (mounted) => {
        const sw = await navigator.serviceWorker.getRegistration('/notification-worker.js')
        if (!sw || !mounted) return;
        setRegistration(sw)

        const state = await sw.pushManager.permissionState({ userVisibleOnly: true, applicationServerKey: vapidKey })
        // Do not set prompt on page load -> prompt would be blocked by browser
        if (mounted && state !== "prompt") {
            setPermissionState(state)

            // if permission granted -> check current subscription and re-subscribe if needed
            if (state === "granted") {
                const currentSubscription = await sw.pushManager.getSubscription()
                if (currentSubscription == null && mounted) {
                    logger.info("subscription not active, re-subscribing")
                    subscribeAndSendSubscription(sw);
                }
            }
        }
    }, [])

    useAsyncEffect(async (mounted) => {
        if (!registration) return;

    }, [registration])

    useAsyncEffect(async () => {
        if (!registration || permissionState !== "prompt") return;

        subscribeAndSendSubscription(registration);
    }, [registration, permissionState])

    const callback = useCallback(function () {
        if (!('serviceWorker' in navigator)) return;

        async function run(register: ServiceWorkerRegistration | undefined) {
            if (registration) {
                logger.info("sw already registered")
                setPermissionState("prompt")
                return
            }

            try {
                logger.info("sw registering")
                register = await navigator.serviceWorker.register('/notification-worker.js', {
                    scope: '/'
                });
                const serviceWorker = register.installing || register.waiting || register.active;
                if (!serviceWorker) return

                if (serviceWorker.state === "activated") setRegistration(register)
                else
                    serviceWorker.addEventListener("statechange", function (e) {
                        if (serviceWorker.state == "activated") {
                            logger.info("sw activated")
                            setRegistration(register)
                        }
                    });
                register.waiting?.postMessage({ type: 'SKIP_WAITING' });
                setPermissionState("prompt")
            } catch (err) {
                setPermissionState("denied")
                logger.error("failed to subscribe", err)
            }
        }
        run(registration)
    }, [registration])

    async function unregister() {
        if (registration) await registration.unregister()
        setPermissionState("prompt")
        setRegistration(undefined)
    }

    return [callback, { permissionState: permissionState, unregister }]
}