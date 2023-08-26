import { messageFactory } from './factory.js';

const messages = {
    userManagement: 'Správce uživatelů',
    registration: 'Registrovat',
    deviceControl: 'Správa Zařízení',
    devices: 'Zařízení',
    about: 'Informace',
    visualProgramming: 'Automatizace',
};

export type UiMessageKey = keyof typeof messages;
export default messageFactory(messages);
