#!/bin/bash

docker-compose -f docker-compose-dev.yaml --env-file ./.envs/.env.dev up -d --build --remove-orphans

echo '--- npx prisma generate ---'

docker-compose -f docker-compose-dev.yaml exec -T node_api_dev npx prisma generate

echo '--- npx prisma migrate dev ---'

docker-compose -f docker-compose-dev.yaml exec -T node_api_dev npx prisma migrate dev

echo '--- npx prisma db seed ---'

docker-compose -f docker-compose-dev.yaml exec -T node_api_dev npx prisma db seed

echo '--- Stopping containers ---'

docker-compose -f docker-compose-dev.yaml down --remove-orphans

echo '--- Finished ---'

exit 0

