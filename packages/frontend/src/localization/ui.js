import { messageFactory } from 'framework-ui/lib/localization';
import './successMessages';
import './errorMessages';
import './validationMessages';

const mainMenu = {
    userManagement: 'Správce uživatelů',
    registration: 'Registrovat',
    deviceControl: 'Zařízení',
    devices: 'Správa zařízení',
    about: 'Informace',
};

export default messageFactory(mainMenu);
