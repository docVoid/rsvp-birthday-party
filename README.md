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

Erstelle eine `.env`-Datei im Projektroot:

```env
DATABASE_URL="postgresql://rsvp:rsvp_secret@localhost:5432/rsvp_birthday"
```

### 3. PostgreSQL starten

```bash
docker compose up -d postgres
```

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

Die gesamte App inkl. Datenbank kann per Docker Compose gestartet werden:

```bash
docker compose up -d
```

Dafür wird eine `.env.docker`-Datei mit der `DATABASE_URL` benötigt (Hostname = `postgres` statt `localhost`).

## Nützliche Befehle

| Befehl                      | Beschreibung                         |
| --------------------------- | ------------------------------------ |
| `npx prisma studio`         | Datenbank-GUI im Browser             |
| `npx prisma migrate dev`    | Neue Migration erstellen             |
| `npx prisma migrate deploy` | Migrationen auf DB anwenden          |
| `docker compose down`       | Container stoppen                    |
| `docker compose down -v`    | Container + Datenbank-Volume löschen |
