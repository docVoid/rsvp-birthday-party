# RSVP Birthday Party

Next.js-App für Geburtstags-RSVPs mit PostgreSQL (Prisma ORM).

## Voraussetzungen

- **Node.js** ≥ 22
- **Docker** (für die PostgreSQL-Datenbank)

## Lokale Entwicklung starten

### 1. Dependencies installieren

```bash
npm install
```

### 2. `.env`-Datei anlegen

Kopiere die Vorlage und trage ein selbst erzeugtes Passwort ein (an beiden Stellen dasselbe):

```bash
cp .env.example .env
openssl rand -hex 24   # Passwort erzeugen
```

Die `.env` enthält `POSTGRES_PASSWORD` (wird von Docker Compose gelesen) und `DATABASE_URL` (für die App). Die Datei ist in `.gitignore` und darf nie committet werden.

### 3. PostgreSQL starten

```bash
docker compose up -d postgres
```

Die Datenbank ist nur lokal über `127.0.0.1:5432` erreichbar.

### 4. Prisma Client generieren & Migrationen ausführen

```bash
npx prisma generate
npx prisma migrate deploy
```

### 5. Dev-Server starten

```bash
npm run dev
```

Die App ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Nach einem `git pull`

Falls sich das Prisma-Schema geändert hat:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

## Produktion

Die gesamte App inkl. Datenbank kann per Docker Compose gestartet werden. Vorher werden zwei Dateien benötigt, beide nicht im Repo:

```bash
cp .env.example .env                   # nur POSTGRES_PASSWORD wird hier gebraucht
cp .env.docker.example .env.docker     # DATABASE_URL mit Hostname "postgres"
# In beiden Dateien dasselbe, selbst erzeugte Passwort eintragen (openssl rand -hex 24)
docker compose up -d
```

Die App lauscht nur auf `127.0.0.1:3000`. Für den Zugriff von außen wird ein Reverse-Proxy (z. B. nginx mit HTTPS) davor gesetzt, der auf `http://127.0.0.1:3000` weiterleitet. Die Ports 3000 und 5432 werden bewusst **nicht** öffentlich veröffentlicht.

> Hinweis: Eine Änderung von `POSTGRES_PASSWORD` wirkt nur auf eine neue, leere Datenbank. Bei bestehenden Daten das Passwort zusätzlich in Postgres ändern (`ALTER USER rsvp WITH PASSWORD '...';`) und `.env.docker` anpassen.

## Nützliche Befehle

| Befehl                      | Beschreibung                         |
| --------------------------- | ------------------------------------ |
| `npx prisma studio`         | Datenbank-GUI im Browser             |
| `npx prisma migrate dev`    | Neue Migration erstellen             |
| `npx prisma migrate deploy` | Migrationen auf DB anwenden          |
| `docker compose down`       | Container stoppen                    |
| `docker compose down -v`    | Container + Datenbank-Volume löschen |
