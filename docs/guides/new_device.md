# Nastavení nového zařízení

Před pokračováním se ujistěte, že máte vytvořený účet na platformě [iotdomu.cz](https://iotdomu.cz). To zjistíte tak, že se budete moci přihlásit. Případně se [zaregistrujte](https://iotdomu.cz/registerUser).

## Příprava zařízení

1. Nové zařízení rozbalte a připojte k napájení (nejčasteji je napájené pomocí USB, stačí tedy nabíječka k telefonu)
2. Počkejte 5s než se zařízení spustí
3. Nyní se na telefonu nebo počítači připojte k WiFi síti s názvem `Nastav mě`. Na wifi se lze připojit bez hesla.
4. Během pár vteřit by se Vám měla otevřít webová stránka

![alt text](../_media/guides/new_device/wifiManager.png ':size=250')

> Pokud se stránka neotevřela automaticky, tak ji můžete otevřít zadáním do prohlížeče tuto adresu [http://192.168.4.1](http://192.168.4.1)

5. Pokračujte kliknutím na modré tlačitko `Configure wifi`.
6. Nyní zadejte `SSID` a `password` což je název Vaší domácí Wifi a heslo k ní. Dále je potřeba vyplnit Vaše `uživatelské jméno`, kterým se přihlašujete k platformě [iotdomu.cz](https://iotdomu.cz). Dejt pozor, všechna pole jsou citlivá na velikost písmen. Zvláště telefony často při zadávání uživatelského jména automaticky vloží první písmeno jako velké.
7. Klikněte na modré tlačítko `Save`.
8. Nyní se zařízení pokusí připojit k Vámi zvolené WiFi a ověří existenci zadaného uživ. jména. Tento proces trvá maximálně `10s`. Pokud vše dopadne dobře, tak zařízení začne plně fungovat. Pokud něco selže - připojení k wifi nebo neexistující uživatel, tak se zařízení restartuje a pokračujete znovu krokem `3.`

## Přidání zařízení (asociace)

Tento krok předpokládá úspěšné nastavení zařízení, které je připojeno k Wifi a funguje.

1. Přihlašte se na platformě [iotdomu.cz](https://iotdomu.cz)
2. V platformě běžte do [správy zařízení](https://iotdomu.cz/deviceManagement)
3. Na začátku by se měla objevit sekce `Přidat zařízení` s novým zařízení.

![alt text](../_media/guides/new_device/management.png ':size=250')

4. Na telefonu není vidět ihned tlačítko pro přidání, je potřeba tabulku posunout do leva:

    ![alt text](../_media/guides/new_device/managementSwiped.png ':size=250')

5. Klikněte fialové tlačítko se symbolem `plus`. Otevře se dialog pro umístění zařízení:

![alt text](../_media/guides/new_device/managementAddDevice.png ':size=250')

6. Vyplňte umístění Vašeho nového zařízení. Pomocí umístění lze seskupovat jednotlivá zařízení - místností se seskupují pod budovy a místnost obsahuje skupinu zařízení. Uložte formulář.

7. Nyní uvidíte nově přidané zařízení v [přehledu zařízení](https://iotdomu.cz/devices) po rozkliknutí příslušné místnosti, do které jste ho umístili.
