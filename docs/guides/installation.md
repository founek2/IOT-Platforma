# Instalace služeb

## MongoDB

Nainstalujte databázi MongoDB dle [návodu](https://docs.mongodb.com/manual/installation/). Dále je nutné zapnout autentifikace [návod](https://docs.mongodb.com/manual/tutorial/enable-authentication/) a vytvořit uživatele, kterého bude platforma používat.

## Nginx

Nainstalujte reverzní proxy Nginx dle [návodu](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/). Následně vytvořte konfigurace reverzní proxy, šablona:
[nginx.config](_media/nginx.config ':ignore')

## RabittMQ

Nainstalujte RabitMQ dle [návodu](https://www.rabbitmq.com/download.html) a zapněte plugin pro [MQTT](https://www.rabbitmq.com/mqtt.html). Následně vygenerujte certifikáty pro [tls](https://www.rabbitmq.com/ssl.html), aby klienti mohly komunikovat šifrovaně. Nyní vytvořte konfiguraci pro RabbittMQ, aby využíval pro autentifikace API platformy:
[rabbitmq.config](_media/rabbitmq.config ':ignore')

# Služby třetích stran

## Firebase project

1. Vyvtořte si google cloud project https://console.cloud.google.com
2. Aktivujte si storage API https://cloud.google.com/storage/docs/getting-service-account
    - pro větší object dat je potřeba zapnout billing - google dává zdarma kredit za 7K
3. Přidejte FireBase k Vašemu vytvořenému google projectu https://console.firebase.google.com - klidněte na `Add project` a z nabídky vyberte existující google project
4. na webu firebase console, běžtě do nastavení projectu -> "Service accounts" a vygenerujte si credentials (stáhne se json soubor), ty budete potřebovat pro spuštění aplikace

## Email

Pro funkční odesílání emailů si připravte emailový účet, který Platforma využije - smtp server, jméno, heslo.
