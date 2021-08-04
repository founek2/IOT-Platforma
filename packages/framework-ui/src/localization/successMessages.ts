import { messageFactory } from '.';
import * as types from '../types';

export const messages: types.messages = {
    successfullyLoggedIn: 'Jste úspěšně přihlášen',
    userCreated: 'Uživatel byl úspěšně vytvořen',
    userSuccessfullyDeleted: 'Uživatel byl vymazán',
    userUpdated: 'Uživatel byl aktualizován',
    successfullySignedOut: 'Odhlášení proběhlo úspěšně',
    successfullyUpdated: 'Změna uložena',
    successfullyDeleted: 'Odstraněno',
};

export default messageFactory(messages);
