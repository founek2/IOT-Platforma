# Backend

Tento proces s využitím frameworku \hyperref[expressjs]{ExpressJS} implementuje webový server nabízející RESTful rozhraní pro vytváření, editaci a mazání všech entit Platformy. Data se odesílají a konzumují ve formátu JSON. Proces dále implementuje odesílání emailů.

## Struktura

```
src
│
└───api             - zdrojové kódy pro jednotlivé endpointy
│   │   device
│   │   discovery
│   │   history
│   │   notify
│   │   thing
│   └───user
│   jobs            - definice úkolů pro AgendaJS
│   loaders         - rozdělený startovací proces do modulů
│   middleware      - definice vlastních middleware
│   services        - zdrojové kódy služeb
└───subscribers     - obsluha akcí na asynchroní události
```

## RESTful rozhraní

Všechny endpointy, až na přihlášení a registraci uživatele, vyžadují autentizační token v hlavičce požadavku. Odpověď se potom liší podle oprávnění daného uživatele. Ukázka rozhraní:

-   **POST** /user - vytvoří nového uživatele
-   **GET** /device - vrací seznam zařízení
-   **DELETE** /device/:deviceId - odstraní dané zařízení
-   **PATCH** /device/:deviceId - aktualizuje zařízení
-   **GET** /device/:deviceId/thing/:thingId/history?from=\&to - vrací historická data pro specifikovanou věc, parametry specifikují časový rozsah
-   **PUT** /device/:deviceId/thing/:thingId/notify - nastaví notifikační pravidla pro určitou věc
-   **PATCH** /device/:deviceId/thing/:thingId - aktualizuje state pro danou věc

Server na požadavky odpovídá následujícími HTTP kódy (tělo odpovědi obsahuje podrobnější chybovou hlášku):

-   **200** v pořádku, součástí těla odpovědi jsou data
-   **204** v pořádku, tělo odpovědi je prázdné
-   **400** chybný požadavek
-   **403** nedostatečné oprávnění
-   **404** požadovaný zdroj nebyl nalezen
-   **500** chyba serveru
