# Node.js NATS Sample

Dieses Sample zeigt, wie du aus Node.js heraus einen simplen Provider und Consumer für den u-OS Data Hub aufsetzt. Die Messages sind JSON-basiert und dienen als leichtgewichtige Alternative zu den umfangreichen FlatBuffer-Beispielen aus dem Python-Sample.

## Setup

```bash
cd nats-node-sample
cp .env.example .env
npm install
```

Trage in `.env` die IP/Port deines u-OS Geräts sowie die OAuth-Credentials ein. Die Werte findest du im u-OS Control Center unter **Identity & access → Clients → Add client** (siehe Screenshot im Python-README).

## Provider starten

```bash
npm run provider
```

- Holt automatisch ein OAuth-Token
- Stellt eine NATS-Verbindung (`token`-Auth) her
- Schickt im Sekundentakt Temperaturwerte als JSON auf das in `.env` konfigurierte Subject

## Consumer starten

```bash
npm run consumer
```

- Holt ebenfalls ein OAuth-Token
- Abonniert das gleiche Subject und loggt jede Nachricht

## Tipps

- Für mehrere Provider kannst du einfach mehrere `.env`-Dateien mit unterschiedlichen `PROVIDER_ID`/`NATS_SUBJECT` anlegen.
- Falls du lieber Klartext-Token verwenden willst, kannst du optional `NATS_TOKEN=<token>` in `.env` hinterlegen und den OAuth-Request in `auth.js` überspringen.
- Das Sample ist modular geschrieben – du kannst `auth.js`, `config.js` oder die Publish-Logik problemlos in dein eigenes Projekt übernehmen.
