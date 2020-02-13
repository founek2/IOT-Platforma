# Deploy

## Popis nasazení aplikace do produkce:
Vytvoření buildu frontendu a transpilace backend části pro aktuální verzi nodeJS. Frontend se nasadí do `IOT_DEPLOY_PATH` a transpilovaný backend se dá do složky `distBE`
```
yarn deploy
```
Přikazy pro spuštění jednolivých serverů (backend, backend mqtt):
```
yarn startBE
```