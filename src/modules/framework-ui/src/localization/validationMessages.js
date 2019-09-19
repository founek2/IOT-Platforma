import { messageFactory } from './';

export const messages = {
     notString: 'Zadaná hodnota musí být text',
     higherLength: ({ max }) => `Text nesmí být delší než ${max}`,
     lowerLength: ({ min }) => `Text nesmí být kratší než ${min}`,
     lowerValue: ({ min }) => `Hodnota nesmí být nižší než ${min}`,
     higherValue: ({ max }) => `Hodnota nesmí být vyšší než ${max}`,
     notStartsWith: ({startsWith}) => `Text musí začínat s '${startsWith}'`,
     stringCannotEqualTo: ({notEqual}) => `Text nesmí být '${notEqual}'`,
     notNumber: `Zadaná hodnota musí být číslo`,
     isRequired: 'Toto pole je povinné',
	isNotPhoneNumber: 'Telefoní číslo nemá správný formát',
	isNotEmail: "Email nemá správný formát",
	cannotContainNumbers: "Hodnota nesmí obsahovat čísla",
     isNotFile: "Nahrajte soubor",
     notBool: "Hodnota musí být true/false"
};

export default messageFactory(messages);
