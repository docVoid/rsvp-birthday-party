#!/bin/sh
set -e

echo "[entrypoint] Container startet..."

if [ -z "$DATABASE_URL" ]; then
  echo "[entrypoint] FEHLER: DATABASE_URL ist nicht gesetzt. Abbruch."
  exit 1
fi

# Warte, bis Postgres erreichbar ist, dann Migrationen ausführen
MAX_RETRIES=${MAX_RETRIES:-30}
SLEEP_SECONDS=${SLEEP_SECONDS:-2}
i=0

echo "[entrypoint] Warte auf Datenbank und führe Migrationen aus..."
until npx prisma migrate deploy 2>&1
do
  i=$((i+1))
  if [ "$i" -ge "$MAX_RETRIES" ]; then
    echo "[entrypoint] Migrationen fehlgeschlagen nach $i Versuchen. Abbruch."
    exit 1
  fi
  echo "[entrypoint] Versuch $i fehlgeschlagen – neuer Versuch in ${SLEEP_SECONDS}s..."
  sleep "$SLEEP_SECONDS"
done

echo "[entrypoint] Migrationen erfolgreich. Starte App..."
exec npm start
