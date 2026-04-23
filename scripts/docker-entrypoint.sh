#!/bin/sh
set -e

echo "[entrypoint] Starting container, running Prisma migrations..."

if [ -z "$DATABASE_URL" ]; then
  echo "[entrypoint] WARNING: DATABASE_URL is not set. Aborting migrations."
else
  MAX_RETRIES=${MAX_RETRIES:-12}
  SLEEP_SECONDS=${SLEEP_SECONDS:-3}
  i=0
  until npx prisma migrate deploy
  do
    i=$((i+1))
    if [ "$i" -ge "$MAX_RETRIES" ]; then
      echo "[entrypoint] Migrations failed after $i attempts. Exiting."
      exit 1
    fi
    echo "[entrypoint] Migration attempt $i failed — retrying in $SLEEP_SECONDS seconds..."
    sleep $SLEEP_SECONDS
  done

  echo "[entrypoint] Migrations applied successfully. Generating Prisma client..."
  npx prisma generate
fi

echo "[entrypoint] Starting app"
exec npm start
