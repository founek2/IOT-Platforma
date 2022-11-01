import { messageFactory } from '.';

const messages = {
    userManagement: 'Správce uživatelů',
    registration: 'Registrovat',
    deviceControl: 'Zařízení',
    devices: 'Správa zařízení',
    about: 'Informace',
    visualProgramming: 'Automatizace',
};

export type UiMessageKey = keyof typeof messages;
export default messageFactory(messages);
