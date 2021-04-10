import { messageFactory } from "./index";
import * as types from "../types";

export const messages: types.messages = {
    userAlreadyExist: "Uživatel již existuje",
    passwordMissmatch: "Nesprávné heslo",
    unknownUser: "Neznámý uživatel",
    userDoesNotExist: "Uživatel neexistuje",
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
    InvalidParam: "Špatný request",
    notImplemented: "Funkce není implementována",
    entityNotFound: "Požadovaný zdroj nebyl nalezen",
};

export default messageFactory(messages);
