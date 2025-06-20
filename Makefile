.PHONY: up down logs

APP_NAME=munto
PORT=3000

up:
	docker-compose down
	docker-compose up -d --build

down:
	docker-compose down

logs:
	docker-compose logs -f