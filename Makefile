HELL = /bin/bash
### https://makefiletutorial.com/

include .env
export

docker-compose:= docker compose -f docker-compose.yml
docker-tgbot := docker exec -it tgbot

re-create: build stop run logs

stop:
	docker stop tgbot

build:
	docker build -t tgbot .

run:
	docker run -d -p 3000:3000 --name tgbot --rm tgbot

bash-tgbot:
	$(docker-tgbot) sh

logs:
	 docker logs tgbot --tail=100 --follow
