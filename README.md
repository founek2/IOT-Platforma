# IOT Platforma

## Features
### `Senzory`
* zachovávat pořadí zařízení
* box s plus pro přídánávání
* componenta pro zobrazování "aktualizováno před" s forceUpdate v intervalu

### `Login`
* authType - různé typy přihlášení (gmail, scanner)
* po zadání jména dotáhnout authType

### `Technologie`
* pro nová data a ovládání - webSocket
* klient si ověří sám časovou platnost tokenu -> "Vypršelo přihlášení"

## Frontend
### `Devices`
* na vytvoření vrátit API key, který se vloží do temporaryData (store - temporaryData: {dialog: {apiKey: ""}}, formulář pro vytvoření checkuje, jestli apiKey je -> zobrazí dialog. Na zavření ho smaže. TempData.dialog se mažou i při zmněně url

## Backend
### `framewor`
* middleware pro kontrolu formDat, dostane fieldDescriptory

### `mongo`
* u senzorů ukládat data:
	- historická do pole podle nastavené periodiky a aktuální ukládat do jiného solo záznamu
	- na zařízení půjdou práva na čtení (zobrazení) a potom editaci (zápis)
	- u uživatele mít uložené preference k jednotlivým zařízením (např. tohle skryté z view)

### `Uživatelé`
	- user - edituje svoje vlastní senzory, může vidět, ty které má přidané a ovládat, ty na kterých ma povoleno
	- userAdmin - editace všech uživatelů se skupinou "user"
	- deviceAdmin - vidí všechny uživatele "user" a může jim přidávat práva k senzorům a ovladačům
	- root - dědí vlastnosti všech skupipn (může vše) :)

## Framework obecně
* místo posílání sucess messages, přidat do api frontendu položku - sucessMessage, která se zobrazí na 200 OK