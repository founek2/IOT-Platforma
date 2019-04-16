# IOT Platforma v1
## Původní využití
* testovací implementace pro připojení pár zařízení doma
* senzory vidí všichni na webu, i ovládání všech zařízení - ovládat lze jenom s přihlášení -> `chybí jakákoliv oprávnění,nejsou udělané žádné formuláře na tvorbu jak zařízení, tak uživatelů`

## Nedostatky
### Frontend
* nízká flexibilita kvůli nepoužití Reduxu - přidání notifikací byle velmi komplikované
* nedokonalá integrace routeru

### Backend
* malé oddělení frameworku a vlastní implementace
* chybějící webSockety


# IOT Platforma v2
## Obecný popis
* Platforma bude nyní otevřená -> volná registrace, každý si bude moci vytvořit vlastní zařízení, ke kterému bude mít oprávnění pouze on a může oprávnění přidávat dalším uživatelům
* Budou správci uživatelů a správci zařízení - vše řešeno přez uživatelské role a oprávnění.
* Pro dynamický update dat ze senzorůse využijí webSockets

## Uživatelé
* základní role:
	* `user` - basic user s možností vytváření vlastních zařízení
	* `userAdmin` - může editovat a mazat ostatní uživatele
	* `deviceAdmin` - spravuje všechny zařízení
	* `root` - může vše, protože proč ne

## Frontend
### /registerUser
* formulář pro registraci uživatele s možností výběru autentifikace (heslo je default a potom jako fallback, budou se implementovat webAuth api) - po registraci je automaticky přihlášen.

### /
* zobrazení jednotlivých zařízení s údaji ze senzorů. Pro veřejnost se zobrazí public senzry, pro přihlášeného uživatele public + ty na které má oprávnění

### /devices
* rozhraní pro správu zařízení. Tj. zobrazené boxy se zařízením u kterých vidí jaké veličiny zařízení posíla. Má možnost kliknout na editaci zařízení jako takového (změna názvu, popis, obrázku)
* může kliknout na editování senzorů (změna názvu veličin, jednotek a klíče - to je klíč v JSONu s datou hodnotou, co zařízení pošle, aby to šlo mapovat z dat od zařízení)
* editace ovládání - ještě nevím jak přesně to bude

### /editUsers
* rozhraní pro editaci uživatelů - v tabulce bude jejich overview + možnost otevření editačního formuláře

## Backend
### DB
* MongoDB a klient používám mongoose - má mapování schémat na dokumenty, kde lze dělat validace a pokročilé featury

### Technologie
* Express jako framework pro REST API
* WebSockets - přes ně se boud posílat nové hondnoty ze senzorů a změny statu ovládaných zařízení
* Mqtt - bude použito pro komunikace s IOT zařízeními
	* důvod odklonu od HTTP:
		* http je potřeba zpracovat ihned -> u velkého množství požadavků budou zařízení generovat giga provoz a mohlo by to zbytečně zpomalovat načítání jiných věcí od uživatelů
		* mqtt implementace mají fronty zpráv nejčastěji v redis db (in memory DB), a pak jsou workeři, kteří zpracovávají ty dané zprávy, ale nemusí ke zpracování dojít ihned -> lepší rozložení zdrojů