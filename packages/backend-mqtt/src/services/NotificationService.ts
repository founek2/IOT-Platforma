import webpush from "web-push"


export class NotificationService {
    constructor({ publicVapidKey, privateVapidKey }: { publicVapidKey: string, privateVapidKey: string }) {
        webpush.setVapidDetails("mailto: martin.skalicky@iotdomu.cz", publicVapidKey, privateVapidKey)
    }
}