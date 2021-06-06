# Ovládání hlasem
Platforma podporuje ovládání zařízení pomocí hlasových asistentek třetích stran. Požadavky:
1. Být zaregistraván na Platformě ([registrace](https://dev.iotplatforma.cloud/registerUser))
2. Přihlásit se k Platformě svým účtem
3. Mít oprávnění ovládat cílové zařízení, které chcete ovládat

## Vytvoření přístupového klíče
Pro ověření identity a oprávnění k události je potřeba k požadavku přidat přístupový klíč. Pokud ho ještě nemáte, tak si ho lze vytvoři následujícím postupem. Pro vyšší bezpečnost používejte jiný klíč pro každou službu.

Jděte do nastavení účtu

![Rooms](../_media/guides/voice/screen-userMenu.png ':size=300')

Přidejte nový token

![Rooms](../_media/guides/voice/screen-accessTokens-empty.png ':size=300')

Pojmenujte ho a nastavte příslušné oprávnění pro ovládání.

![Rooms](../_media/guides/voice/screen-accessTokens-add.png ':size=300')

![Rooms](../_media/guides/voice/screen-accessTokens-notEmpty.png ':size=300')

Až budete token později potřebovat, tak ho najdete opět v této sekci.

## Získání URL ovládacího prvku
Z každého ovládacího prvku (přepínač, spínač atd...) lze získat ovládací URL - pomocí pravého kliknutí na prvek nebo dlouhým podržením na telefonu. Tato URL se dá využít pro vytvoření zkratky pro `Siri` či ovládání zařízení ze skriptů např. pomocí utility `curl`.

Přidržte prst (či klikněte pravým tlačítkem myši) nad cílovím ovládacím prvkem, pro který chcete získat URL a objeví se tlačíko `Kopírovat URL` - po kliknutí na něj, se zkopíruje URL do schránky.

![Rooms](../_media/guides/voice/screen-copyUrl.png ':size=300')

## Ovládání pomocí Siri
Asistentka `Siri` umožňuje na systému iOS vytvářet zkratky pomocí, kterých lze napojit ovládání určitého prvku Platformy tak, že bude ovladatolný hlasovým povelem.

V telefonu otevřete aplikaci `Zkratky` a klikněte na plus pro přidání nové.

![Rooms](../_media/guides/voice/iOS-shortcuts.png ':size=300')

Přidejte novou akci.

![Rooms](../_media/guides/voice/iOS-shortcuts-new.png ':size=300')

Vyberte typ akce `Web`.

![Rooms](../_media/guides/voice/iOS-shortcuts-new-category.png ':size=300')

Vyplňte získanou URL z cílového ovládacího prvku Platformy (viz. [Získání url ovládacího prvku](#získání-url-ovládacího-prvku)). Změňte metodu na POST a přidejte hlavičku s levou stranou `X-API-Key` a na pravou stranu vložte přístupový klíč (viz. [Vytvoření přístupového klíče](#vytvoření-přístupového-klíče))

![Rooms](../_media/guides/voice/iOS-shortcuts-new-filled.png ':size=300')

Nyní již stačí napsat na jaký hlasový povel se má akce provést.

![Rooms](../_media/guides/voice/iOS-shortcuts-new-name.png ':size=300')