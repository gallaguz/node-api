#!/bin/bash

docker-compose -f docker-compose-prod.yaml --env-file ./.envs/.env.prod up -d --build --remove-orphans

echo '--- npx prisma generate ---'

docker-compose -f docker-compose-prod.yaml exec -T node_api_prod npx prisma generate

echo '--- npx prisma prisma migrate dev ---'

docker-compose -f docker-compose-prod.yaml exec -T node_api_prod npx prisma migrate dev

#echo '--- npx prisma migrate deploy ---'
#
#docker-compose -f docker-compose-prod.yaml exec -T node_api_prod prisma migrate deploy

#echo '--- npx prisma db seed ---'
#
#docker-compose -f docker-compose-prod.yaml exec -T node_api_prod npx prisma db seed

echo '--- Stopping containers ---'

docker-compose -f docker-compose-prod.yaml --env-file ./.envs/.env.dev down --remove-orphans

echo '--- Finished ---'

exit 0

