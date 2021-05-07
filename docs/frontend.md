# Frontend

Modul obsahuje nejrosáhlejší zdrojový kód frontend aplikace. Základní knihovnou je React s Reduxem pro state management a framework material-ui (obsahuje nastylované komponenty).

Uživatelské rozhraní je realizováno jako SPA - průchod celou aplikací je plynulý a nikdy nedochází k přenačítání celé stránky, ale pouze k překreslení potřebných částí. Toto řešení zlepšuje uživatelský zážitek, protože stránka zůstává pořád plně aktivní a při čekání na vyřízení požadavku uživatel může pokračovat v interakci. Také je zde implementován standard PWA - v podporovaných systémech jako je např. android lze aplikaci tzv. \uv{Přidat na plochu}, potom při otevření vypadá jako nativní aplikace (nemá zobrazený url bar). Statické soubory jsou v cache, díky čemuž je minimalizován datový přenost a stav aplikace je perzistentně ukládán, takže při zavření aplikace a následném otevření je stav plně obnoven a uživatel pokračuje přesně tam kde skončil naposledy a to i v případě bez přístupu k internetu - aplikace je kompletně načtena, ale následná interakce je již závislá na komunikaci se serverem.

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
