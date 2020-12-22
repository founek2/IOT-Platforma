// 
import messageFactory from 'framework-ui/lib/localization/errorMessages';

const messages = {
    topicAlreadyUsed: "Zadaný topic je již obsazen",
    InvalidDeviceId: "Neznámé zařízení",
    notificationsDisabled: "Toto zařízení má vypnuté notifikace",
}

messageFactory.registerMessages(messages)