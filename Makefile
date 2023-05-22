HELL = /bin/bash
### https://makefiletutorial.com/

include .env
export

docker := $(shell command -v docker 2> /dev/null)
docker-compose:= docker compose -f docker-compose.yml
docker-tgbot := $(docker) exec -u root -it tgbot-npm

build:
	docker build -t tgbot .

run:
	docker run -d -p 3000:3000 --name tgbot --rm tgbot

bash-tgbot:
	$(docker-tgbot) bash

logs:
	 docker logs tgbot --tail=100 --follow
