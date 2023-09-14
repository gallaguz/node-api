#!/bin/bash

docker-compose -f docker-compose-dev.yaml  --env-file ./.envs/.env.dev up --remove-orphans &

function stop_project {
    echo "--- Stopping project: ---"

    docker-compose -f docker-compose-dev.yaml down --remove-orphans

    echo "--- All process stopped ---"

    docker ps

    exit 0
}

trap stop_project INT

while true; do
    sleep 1
done
