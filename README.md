# Node.js NATS Samples für den u-OS Data Hub

Dieses Projekt ist das Node.js-Pendant zu den Python-Samples und zeigt, wie Provider und Consumer über NATS mit dem u-OS Data Hub sprechen. Die Skripte sind in TypeScript geschrieben, die generierten FlatBuffers liegen bereits bei – du kannst das Projekt daher sofort klonen, konfigurieren und starten.

---

## 1. Verzeichnisstruktur

```
nats-node-sample/
├── src/                    # TypeScript-Quellen (Provider, Consumer, Helpers, Auth)
├── dist/                   # Build-Ausgabe (wird von tsc erzeugt)
├── samples/                # Zusätzliche Beispiele (falls benötigt)
├── doc/                    # GIFs/Screenshots für die README
├── .env.example            # Vorlage für deine Konfiguration
├── package.json            # npm-Skripte („provider“, „consumer“, …)
└── tsconfig.json           # TypeScript-Konfiguration
```

---

## 2. Vorbereitungen auf der Steuerung

1. **OAuth-Clients anlegen** (Control Center → *Identity & access → Clients → Add client*)
   - **Provider** `sampleprovider`: Access `hub.variables` → Rolle **Provide**
   - **Consumer** `sampleconsumer`: Access `hub.variables` → Rolle **ReadWrite** (oder Read)
   - Die zugehörigen Client-ID & Secrets notieren.

![Control Center Workflow](doc/IoTUeli-u-OS.gif?raw=true)

2. **Token-Test ausführen** (ersetzt `<IP-ODER-HOST>` durch deine Steuerung):
   ```bash
   curl -vk -u '<CLIENT_ID>:<CLIENT_SECRET>' \
        -d 'grant_type=client_credentials&scope=hub.variables.provide' \
        https://<IP-ODER-HOST>/oauth2/token
   ```
   Erfolgreich ist der Test, wenn ein `access_token` zurückkommt. Für den Consumer analog mit `scope=hub.variables.readwrite` testen.

---

## 3. Projekt klonen & installieren

```bash
git clone https://github.com/uiff/nats-nodejs-uc20.git
cd nats-nodejs-uc20
cp .env.example .env
npm install
```

> Das Projekt ist auf einem Entwicklungsrechner und direkt auf der u-OS-Steuerung lauffähig. Falls du es auf dem Gerät ausführst, genügt als Host später `127.0.0.1`.

---

## 4. Konfiguration (.env)

| Variable             | Beschreibung                                                                |
|----------------------|-----------------------------------------------------------------------------|
| `HUB_HOST` / `HUB_PORT` | IP/Port des NATS-Servers (Steuerung). Auf dem Gerät selbst: `127.0.0.1` / `49360`. |
| `PROVIDER_ID`        | Anzeigename des Providers (muss zur Registry passen).                       |
| `CLIENT_NAME`        | Name, mit dem sich der NATS-Client meldet – sollte dem OAuth-Client entsprechen. |
| `CLIENT_ID` / `CLIENT_SECRET` | Aus dem Control Center kopieren.                                    |
| `TOKEN_SCOPE`        | Meist `hub.variables.provide hub.variables.readwrite` (Provider + Consumer). |
| `PUBLISH_INTERVAL_MS`| Intervall für simulierte Updates.                                           |

> Nach jeder Änderung in `.env` den gewünschten npm-Task neu starten. Die Skripte lesen die Konfiguration beim Start ein.

---

## 5. Provider starten

```bash
npm run provider
```

- kompiliert TypeScript (`tsc`) und startet `dist/provider.js`
- holt automatisch ein OAuth-Token und verbindet sich mit NATS (`token`-Auth)
- registriert die Providerdefinition und sendet anschließend Variablenänderungen

![Data Hub Ansicht](doc/IoTUeli-Datahub.gif?raw=true)

---

## 6. Consumer starten

```bash
npm run consumer
```

- holt ein Token mit den gleichen Credentials
- fragt einmalig einen Snapshot über `v1.loc.<provider>.vars.qry.read` ab
- lauscht anschließend auf `…vars.evt.changed` und loggt jede Änderung

Auf einem u-OS-Gerät kannst du damit sofort prüfen, ob deine Variablen im Data Hub ankommen oder ob ein bestehender Provider (s. u.) gelesen werden soll.

### Bestehenden Provider auslesen (z. B. `u_os_adm`)

1. Passe in `.env` `PROVIDER_ID` und `CLIENT_NAME` an den gewünschten Provider an.
2. Verwende einen OAuth-Client mit mindestens `hub.variables.readonly`. System-Provider wie `u_os_adm` lassen sich so auslesen.
3. Führe `npm run consumer` aus – das Skript arbeitet dann mit dem neuen Provider.

---

## 7. Troubleshooting

- **401 `invalid_client`** – Client-ID/Secret oder Scope stimmt nicht. Token-Test wiederholen.
- **`permissions violation`** – dem OAuth-Client fehlen `Provide`/`ReadWrite`. Rechte im Control Center korrigieren und Skript neu starten.
- **`nats: no responders available`** – Provider läuft nicht oder `PROVIDER_ID` stimmt nicht. Provider zuerst starten.
- **Self-signed TLS** – `auth.ts` setzt `NODE_TLS_REJECT_UNAUTHORIZED = "0"` (nur für Labs). In produktiven Umgebungen solltest du das echte Zertifikat installieren und die Prüfung wieder aktivieren.
- **Unerwartete Providerliste** – Starte den Provider neu oder prüfe in der UI, ob der Registry-Status auf `OK` steht.

---

Viel Erfolg! Das Projekt ist bewusst minimal gehalten – passe die Simulation (`src/simulation.ts`) oder die Payloads (`src/payloads.ts`) an deine Bedürfnisse an und deploye sie anschließend über deinen bevorzugten Weg (Node direkt, Docker, PM2 …). Wenn du Fragen hast, melde dich gern. 🙂
