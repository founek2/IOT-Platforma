import { messageFactory } from 'framework-ui/src/localization';
import "./successMessages"
import "./errorMessages"

const mainMenu = {
     dashboard: 'Dashboard',
	userManagement: 'Správce uživatelů',
	registration: "Registrovat",
	sensors: "Senzory",
	deviceControll: "Ovládání",
	devices: "Zařízení"
};

export default messageFactory(
	mainMenu
);
