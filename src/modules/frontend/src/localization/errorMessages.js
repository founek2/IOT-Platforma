// 
import messageFactory from 'framework-ui/src/localization/errorMessages';

const messages = {
	topicAlreadyUsed: "Zadaný topic je již obsazen",
	InvalidDeviceId: "Neznámé zařízení",
	notificationsDisabled: "Toto zařízení má vypnuté notifikace"
}

messageFactory.registerMessages(messages)