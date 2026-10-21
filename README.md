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

Vorlage kopieren und ein Passwort eintragen, in `POSTGRES_PASSWORD` und in der `DATABASE_URL`:

```bash
cp .env.example .env
openssl rand -hex 24
```

Die `.env` ist in `.gitignore` und wird nicht committet.

### 3. PostgreSQL starten

```bash
docker compose up -d postgres
```

Die Datenbank ist nur lokal unter `127.0.0.1:5432` erreichbar.

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

Die gesamte App inkl. Datenbank kann per Docker Compose gestartet werden. Dafür werden zwei Dateien benötigt:

```bash
cp .env.example .env
cp .env.docker.example .env.docker
docker compose up -d
```

- `.env`: `POSTGRES_PASSWORD`
- `.env.docker`: `DATABASE_URL` mit Hostname `postgres` statt `localhost` und demselben Passwort

App und Datenbank sind nur auf `127.0.0.1` erreichbar. Von außen läuft der Zugriff über einen Reverse-Proxy auf `http://127.0.0.1:3000`.

Ein geändertes `POSTGRES_PASSWORD` gilt nur für eine neue Datenbank. Bei bestehenden Daten zusätzlich `ALTER USER rsvp WITH PASSWORD '...';` ausführen.

## Nützliche Befehle

| Befehl                      | Beschreibung                         |
| --------------------------- | ------------------------------------ |
| `npx prisma studio`         | Datenbank-GUI im Browser             |
| `npx prisma migrate dev`    | Neue Migration erstellen             |
| `npx prisma migrate deploy` | Migrationen auf DB anwenden          |
| `docker compose down`       | Container stoppen                    |
| `docker compose down -v`    | Container + Datenbank-Volume löschen |
