import messageFactory from 'framework-ui/src/localization/successMessages';

const messages = {
    deviceCreated: 'Zařízení vytvořeno',
    deviceUpdated: 'Zařízení aktualizováno',
    deviceDeleted: 'Zařízení bylo odstraněno',
    notificationsUpdated: 'Notifikace nastaveny',
    commandSended: 'Požadavek odeslán',
    tokenCreated: 'Token byl vytvořen',
};

messageFactory.registerMessages(messages);
