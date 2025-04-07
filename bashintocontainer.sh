#!/usr/bin/env bash

container_name="deno-docker-myapp"

amount=$(docker ps | grep $container_name | wc -l)

if [ $amount -eq 1 ]; then
  docker exec -it $(docker ps | grep $container_name | cut -d" " -f1) /bin/bash
else
  echo "Container $container_name not found"
fi

