import { messageFactory } from 'framework-ui/lib/localization';
import "./successMessages"
import "./errorMessages"
import "./validationMessages"

const mainMenu = {
    dashboard: 'Dashboard',
    userManagement: 'Správce uživatelů',
    registration: "Registrovat",
    sensors: "Senzory",
    deviceControl: "Ovládání",
    devices: "Zařízení"
};

export default messageFactory(
    mainMenu
);
