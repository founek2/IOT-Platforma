# Deployment

Spusťte v rootu projektu následující příkaz, který vytvoří produkční sestavení platformy.

```bash
yarn build
```

## Frontend

Obsah složky `packages/frontend/public` nakopírujte do umístění, které máte nastavené v nginx konfigurace místo PATH_TO_FRONTEND_BUILD.

## Procesy

Každý ze složek `packages/backend/dist/index.js` a `packages/backend-mqtt/dist/index.js` obsahuje kód pro spuštění jednoho procesu. Pro spuštění si zvolte vámi oblíbený správce procesů nebo můžete využít předpřipravenou šablonu pro systemd - stačí změnit umístění spustitelného souboru a souboru s enviroment promněnými:
[unit.service](_media/unit.service ':ignore')
