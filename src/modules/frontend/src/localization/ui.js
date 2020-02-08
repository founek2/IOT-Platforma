import { messageFactory } from 'framework-ui/src/localization';
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
