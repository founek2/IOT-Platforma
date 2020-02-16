# Framework-ui

Modul obsahuje zdrojový kód vlastního frameworku pro UI část, který primárně obstarává validace formulářů, handling requestů, zobrazení notifikací a má několik vlastních komponent postavených nad material-ui.

## Struktura
```
frontend
│   package.json
└───test                        - testy
└───src
    │
    └───api
    │   │   authApi.js
    │   │   deviceApi.js
    │   
    └───callbacks               - registrace callbacku pro zajímavé události
    │   │   login
    │   └───logout
    │
    └───Components              - definice komponent
    │                           
    │   
    └───constants
    │   
    └───dto                     - vlastní datové objekty
    │   │   MyFile.js           - obsahuje soubor jako url a jeho název
    │   └───MyFileData.js       - obsahuje název a data souboru v base64
    │   
    └───localization            - řešení error a success hlášek stylem { klíč: text }
    │
    └───Logger
    │   
    └───privileges              - implementace problematiky oprávnění
    │   
    └───redux                   - obsahuje všechnu logiku týkající se reduxu
    │   └───actions
    │   └───reducers
    │   
    └───utils                   - pomocné funkce
    │   
    └───validations
        │   index.js                - obsahuje definice všech formulářových fieldů
        │   validationFactory.js    - Provider pro validační funkce + možnost registrace custom
        └───validationFn.js         - implementace validačních funkcí
```

## Formuláře a validace
Framework se stárá o centralizované ukládání hodnot jednotlivých fieldů a jejich následnou validaci. Pro každý field je potřeba nejprve vytvořit jeho `field descriptor` a potom ho napojit do frameowrku pomocí komponenty `FieldConnector`.

### Jak to funguje?
Při renderu field konektor se vytvoří v reduxu záznam (v cestě formsData.registeredFields.${deepPath}), který obsahuje tyto atributy:
* valid (jak dopadla validace)
* errorMessages - pole error zpráv z výsledku validací.
* pristine (jestli již uživatel něco změnil)

Konektor sleduje změny tohoto záznamu. Případná vyvolaná validace uloží výsledek do tohoto záznamu. V případě nevalidních dat např.:
* valid = false
* errorMessages: ["Hodnota musí mít minimální délku 3", "Hodnota musí obsahovat řetězec ble"]

Konektor následně předá svému potomkovi tyto data, který je zobrazí uživateli v rozhraní.

Volání validací je velmi chytré. První validace se na field zavolá až když uživatel poprvé změnil hodnotu (pristine = false) a zavolal se onBlur event. Potom se již validace volají na každou změnu hodnoty. Toto řešení je velice uživatelsky přívětivé.

### Field descriptory
Do storu je potřeba načíst pod atribut fieldDescriptors definice všech formulářů a jejich fieldů v následujícím tvaru:
```
    {
        FORM_NAME: {
            some: {
                path: {
                    deepPath: "FORM_NAME.some.path",        # path to field descriptor definition
                    label: "Název který se zobrazí u pole",
                    when: (formData) => formData.selected === "user",   # pokud vrátí false, tak required bude ingorováno
                    required: true/false,
                    validations: [validationFactory('isString', {min: 3, max: 10})],    # pole validací, kterými se má validovat hodnota
                }
            }
        }
    }
```
První úroveň je tedy název formuláře, potom může být libovolná hloubka a nakonec objekt, který musí obsahovat definice atribut `deepPath`.

### Field connector
Jedná se o komponentu v Reactu, která se stará o napojení do Reduxu a správné volání validací. Ukázka nejjednodušší definice, která zobrazí TextField:
```
<FieldConnector deepPath={`FORM_NAME.info.firstName`} />
```
FieldConnector má následující props:
* deepPath - deepPath pro field deskriptor
* component = 'TextField',
* fieldProps - object, který se předá jako jednotlivé props do komponenty
* selectOptions - možnosti pro Select komponentu jako React komponenta
* optionsData - možnosti pro ChipArray
* autoFocus - true/false
* className
* label - přepíše label z field deskriptoru
* name - přepíše name z  field deskriptoru
* component - podporuje základní možnosti:
`TextField`, `Select`, `ChipArray`, `FileLoader`, `PasswordField`, `Checkbox`. Případně lze předat komponentu jako funkci

akce:
* onChange - při změně hodnoty
* onBlur - out focus
* onFocus
* onEnter - stisknutí klávesi enter v daném fieldu