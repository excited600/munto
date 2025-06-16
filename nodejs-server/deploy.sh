#!/bin/bash
APP_NAME=munto
PORT=3000

echo "Building image..."
docker build -t "$APP_NAME" .

# 이미 실행 중인 컨테이너가 있으면 정지·삭제
if docker ps -a --format '{{.Names}}' | grep -Eq "^${APP_NAME}\$"; then
  echo "Stopping old container..."
  docker stop "$APP_NAME"  >/dev/null
  docker rm   "$APP_NAME"  >/dev/null
fi

echo "Running new container..."
docker run -d --name "$APP_NAME" -p "$PORT:$PORT" "$APP_NAME"
echo "Deploy complete!"