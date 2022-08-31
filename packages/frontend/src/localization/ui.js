import { messageFactory } from 'framework-ui/src/localization';
import './successMessages';
import './errorMessages';
import './validationMessages';

const mainMenu = {
    userManagement: 'Správce uživatelů',
    registration: 'Registrovat',
    deviceControl: 'Zařízení',
    devices: 'Správa zařízení',
    about: 'Informace',
    visualProgramming: 'Visuální prog.',
};

export default messageFactory(mainMenu);
