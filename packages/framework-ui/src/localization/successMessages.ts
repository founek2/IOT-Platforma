import { messageFactory } from '.';
import * as types from '../types';

export const messages: types.messages = {
    'successfullyLoggedIn': 'Jste úspěšně přihlášen',
    'userCreated': 'Uživatel byl úspěšně vytvořen',
    'userSuccessfullyDeleted': "Uživatel byl vymazán",
    'userUpdated': "Uživatel byl aktualizován",
    'successfullyLogOut': "Odhlášení proběhlo úspěšně"
}

export default messageFactory(messages);