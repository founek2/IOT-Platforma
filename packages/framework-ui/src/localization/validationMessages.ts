import { messageFactory } from './';
import * as types from '../types';

export const messages: types.messages = {
    notString: 'Zadaná hodnota musí být text',
    higherLength: ({ max }) => `Text nesmí být delší než ${max}`,
    lowerLength: ({ min }) => `Text nesmí být kratší než ${min}`,
    lowerValue: ({ min }) => `Hodnota nesmí být nižší než ${min}`,
    higherValue: ({ max }) => `Hodnota nesmí být vyšší než ${max}`,
    notStartsWith: ({ startsWith }) => `Text musí začínat s '${startsWith}'`,
    stringCannotEqualTo: ({ notEqual }) => `Text nesmí být '${notEqual}'`,
    notNumber: `Zadaná hodnota musí být číslo`,
    isNotTime: `Zadaná hodnota musí být čas ve tvaru HH:MM`,
    isRequired: 'Toto pole je povinné',
    isNotPhoneNumber: 'Telefoní číslo nemá správný formát',
    isNotEmail: "Email nemá správný formát",
    cannotContainNumbers: "Hodnota nesmí obsahovat čísla",
    isNotFile: "Nahrajte soubor",
    notBool: "Hodnota musí být true/false",
    isNotIpAddress: "Hodnota není IP adresa",
    isNotOneOf: ({ values }) => "Hodnota musí být jedna z " + values.map((obj: any) => obj.label).join(", "),
    notMatchPattern: ({ pattern }) => `Text musí být ve tvaru '${pattern}'`,
    isNotObject: "Hodnota musí být Objekt",
    isNotValidObject: "Objekt není ve správném formátu",
};

export default messageFactory(messages);
