import { messageFactory } from './index';

export const messages = {
	userAlreadyExist: 'Uživatel již existuje',
	passwordMissmatch: 'Nesprávné heslo',
	unknownUser: 'Neznámý uživatel',
	userDoesNotExist: "Uživatel již neexistuje",
	invalidToken: "Neplatný token",
	tokenNotProvided: "Token nebyl v hlavičce",
	lowPermissionsForThatGroups: "Nízké oprávnění pro nastavení těchto skupin",
	unexpectedError: "Nastala neočekávaná chyba",
	unavailableBackend: "Nedostupný server",
	noneUserFoundForDelete: "Nenalezen uživatel ke smazání",
	cityAlreadyExist: "Toto město již existuje",
	ValidationError: "Odeslaná data nebyla validní",
	payloadTooLarge: "Soubor je příliš velký",
	notAllowedExtension: "Nepodporovaný formát souboru",
	missingFormData: "V dotazu chybí formulářová data",
	invalidPermissions: "Nedostatečná oprávnění",
	validationFailed: "Nevalidní formulář",
	InvalidParam: "Špatný request"
};

export default messageFactory(messages)
