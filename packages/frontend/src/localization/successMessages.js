import messageFactory from 'framework-ui/lib/localization/successMessages';

const messages = {
    deviceCreated: 'Zařízení vytvořeno',
    deviceUpdated: 'Zařízení aktualizováno',
    deviceDeleted: 'Zařízení bylo odstraněno',
    commandSended: 'Požadavek odeslán',
};

messageFactory.registerMessages(messages);
