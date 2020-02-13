# Quick start

Pro spuštění aplikace pro lokální vývoj jsou potřeba tyto příkazy:
```
git clone https://github.com/founek2/IOT-Platforma.git iot-platforma
cd iot-platforma
yarn    # nainstaluje všechny potřebné závislosti
yarn devFE  # spustí lokální vývojový server pro frontend
yarn devBE  # spustí lokální vývojový server pro backend
yarn devBE-mqtt  # spustí lokální vývojový server pro backend-mqtt
```

## Enviroment promněné
Pro správné fungování aplikace je potřeba si nastavit následující env promněné:

* IOT_DB_USER - uživatel pro přístup do DB
* IOT_DB_PASSWD - heslo pro přístup do DB
* IOT_MQTT_USER - uživatel pro přihlášení na MQTT broker
* IOT_MQTT_PASSWD - heslo pro MQTT uživatele
* IOT_PRIVATE_KEY_PATH - cesta k private key pro podepisování JWT tokenů
* IOT_PUBLIC_KEY_PATH - cesta k public key pro validace JWT tokenů

volitelné:
* IOT_DEPLOY_PATH - cesta k nasazení aplikace [default `build`]
* IOT_IMAGES_PATH - cesta k ukládání obrázků [default `build/images`]
