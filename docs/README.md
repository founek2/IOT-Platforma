# IOT Platforma

Projekt vznikl ve volném času za účelem vytvořit alternativní IOT platformu pro co největší množství zařízení. Platforma má moderní webové rozhraní s uživatelskými účty, automatickou detekci nových zařízení a jejich správou. Dále jsou implementována oprávnění, kde každý uživatele má právo k danému zařízení:

-   čtení - možnost zobrazení aktuálních dat ze senzorů a historických údajů
-   ovládání - možnost ovládat dané zařízení
-   zápis - možnost editace zařízení včetně oprávnění

# Ukázka rozhraní

## Přehled místností

Zobrazuje zařízení, které odesílají naměřená data.  
![Rooms](_media/screens/buildings.png ':size=300')

## Místnost

Zobrazuje ovládací prvky, se kterými je možné interagovat. V případě problému se zařízením se objeví v pravém horním rohu příslušného Widgetu barevná tečka: červená - chyba, oranžová - zařízení vyžaduje pozornost, šeda - zařízení není připojené.  
![Room](_media/screens/room.png ':size=300')

## Dialog Widgetu

U jednotlivých Widgetů, po kliknutí na název, se zobrazí dialogové okno. U některých prvků jsou údaje vizualizovány v grafu a případně zobrazeny další ovládací prvky (dle definice azřízení).

![Temperature](_media/screens/temperature.png ':size=300')
![Led control](_media/screens/led.png ':size=300 Room')
![Generic](_media/screens/generic.png ':size=300 Room')

## Správa zařízení

Zde jsou zobrazeny nově detekovaná zařízení a všechny ke kterým má uživatel oprávnění.

![alt text](_media/screens/deviceManagement2.png ':size=700 Device management')

## Registrace

Formulář pro registraci uživatele.  
![alt text](_media/screens/registration.png ':size=300 Ragistration form')

## Menu

![alt text](_media/screens/menu.png ':size=300 Menu')

# Administrátorské rozhraní

## Správa uživatelů

V tabulce jsou všichni registrovaní uživatelé. Je možnost editace a jejich odstranení.  
![alt text](_media/user_management.png ':size=300 User administration')
