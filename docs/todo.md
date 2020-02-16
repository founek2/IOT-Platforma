# TODO

## Features
### `Senzory`
* zachovávat pořadí zařízení
* box s plus pro přídánávání		- Done
* componenta pro zobrazování "aktualizováno před" s forceUpdate v intervalu		- Done

### `Login`
* authType - různé typy přihlášení (gmail, scanner)
* po zadání jména dotáhnout authType		- Done

### `Technologie`
* pro nová data a ovládání (pouze potvrzení o úspěšné změně stavu, odeslání změny je stále request) - webSocket	- Done
* klient si ověří sám časovou platnost tokenu -> "Vypršelo přihlášení"

## Frontend
### `Devices`
* na vytvoření vrátit API key, který se vloží do temporaryData (store - temporaryData: {dialog: {apiKey: ""}}, formulář pro vytvoření checkuje, jestli apiKey je -> zobrazí dialog. Na zavření ho smaže. TempData.dialog se mažou i při zmněně url		- Done

## Backend
### `framewor`
* middleware pro kontrolu formDat, dostane fieldDescriptory	- Done

### `mongo`
* u senzorů ukládat data:
	- historická data se budou ukládat do zvláštní kolekce v mongoDB	- Done
	- na zařízení půjdou práva na čtení (zobrazení) a potom editaci (zápis)	- Done
	- u uživatele mít uložené preference k jednotlivým zařízením (např. tohle skryté z view)

### `Uživatelé`
	- user - edituje svoje vlastní senzory, může vidět, ty které má přidané a ovládat, ty na kterých ma povoleno	- Done
	- userAdmin - editace všech uživatelů se skupinou "user"	- Done
	- deviceAdmin - vidí všechny uživatele "user" a může jim přidávat práva k senzorům a ovladačům	- Done
	- root - dědí vlastnosti všech skupipn (může vše) :)	- Done

## Framework obecně
* místo posílání sucess messages, přidat do api frontendu položku - sucessMessage, která se zobrazí na 200 OK	- Done