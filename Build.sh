#!/bin/sh
echo Building aio/angular:build

docker build -t aio:build . -f Dockerfile.build

docker create --name extract aio:build

docker cp extract:/app/dist/aio-front ./app

docker rm -f extract

echo Building aio/angular:latest

docker build --no-cache -t aio/angular:latest . -f Dockerfile.main