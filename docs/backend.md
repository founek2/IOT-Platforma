# Backend

Modul obsahuje zdrojový kód pro backend část, která komunikuje s webovým prohlížečem pomocí requestů. Základní technologie je NodeJS s frameworkem expressJS a knihovnou Mongoose jako driver pro databázi MongoDB.

## Struktura
```
backend
│   package.json
│   db.js                   - inicializace připojení do DB
│   index.js                - nastavení expressJS a inicializace aplikace
│
└───api                     - obsahuje funkční kód pro jednotlivé endpointy
│   │   auth.js
│   │   device.js
│   │   index.js
│   │   iot.js
│   │   user.js
│   
└───config                  - konfigurace pro backend
│   
└───constants
│   
└───lib                     - pomocné funkce
│   
└───middleware              - definice všech middlewarů
│   │   index.js            - autentizace, formDataChecker, security groups restrictions
│   
└───models                  - definice všech mongoose modelů a implementace jejich metod
│   │   Auth.js
│   │   Device.js
│   │   SensorsData.js
│   │   User.js
│   └───schema              - pomocná schémata pro modely
│   
└───service                 - definice services
│   files.js                - ukládání a mazání obrázků
│   
└───test
```