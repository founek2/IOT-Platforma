import { messageFactory } from './';

export const messages = {
     notString: 'Zadaná hodnota musí být text',
     higherLength: ({ max }) => `Text nesmí být delší než ${max}`,
     lowerLength: ({ min }) => `Text nesmí být kratší než ${min}`,
     lowerValue: ({ min }) => `Hodnota nesmí být nižší než ${min}`,
     higherValue: ({ max }) => `Hodnota nesmí být vyšší než ${max}`,
     notNumber: `Lze zadat jen čísla`,
     isRequired: 'Toto pole je povinné',
	isNotPhoneNumber: 'Telefoní číslo nemá zprávný formát',
	isNotEmail: "Email nemá správný formát",
	cannotContainNumbers: "Nesmí obsahovat čísla",
	isNotFile: "Nahrajte soubor"
};

export default messageFactory(messages);
