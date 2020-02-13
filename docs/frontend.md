# Frontend

Modul obsahuje nejrosáhlejší zdrojový kód frontend aplikace. Základní knihovnou je React s Reduxem pro state management a framework material-ui (obsahuje nastylované komponenty).

## Struktura
```
frontend
│   package.json
└───src
    │
    └───api
    │   │   authApi.js
    │   │   deviceApi.js
    │   
    └───components
    │   └───layout              - definice layout komponenty
    │   
    └───constants
    │   └───index.js            - obecně konstanty
    │   └───redux.js            - konstanty týkající se reduxu
    │   
    └───containers
    │   │   Root.js             - init redux provideru
    │   │   Router.js           - inicializace react-router, sync historie a reduxu
    │   │   WebSocket.js        - inicializace Socket.io spojení
    │   │   withTheme.js        - hoc pro theme provider
    │   
    └───localization            - registrace různých messages pro framework-ui
    │   
    └───Pages                   - obsahuje všechny stránky pro react-router
    │   │   DeviceControl.js
    │   │   Devices.js
    │   │   RegisterUser.js
    │   │   SensorDetail.js
    │   │   Sensors.js
    │   │   UserManagement.js
    │   
    └───privileges          
    │   │   index.js            - registrace práv do frameworku
    │   
    └───store
    │   │   initState.js        - definice výchozího stavu storu
    │   │   store.js            - vytvoření storu, aplikace middlewarů pro redux
    │   └───actions
    │   └───reducers
    │   
    └───utils                   - pomocné funkce
    │   
    └───validations
    │   │   fieldDescriptors.js - obsahuje definice všech formulářových fieldů
    │   
    └───webSocket
        │   index.js            - třída pro init Socket.io a přidání listenerů
```