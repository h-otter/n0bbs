.PHONY: build
build:
	docker-compose build

.PHONY: up
up:
	docker-compose up -d

.PHONY: down
down:
	docker-compose down

.PHONY: log
log:
	docker-compose log -f

.PHONY: migrate
migrate:
	docker-compose exec app /bin/bash -c 'python manage.py makemigrations && python manage.py migrate'

.PHONY: shell
shell:
	docker-compose exec app /bin/bash

.PHONY: generateschema
generateschema: up
	docker-compose exec app /bin/bash -c 'python manage.py generateschema --format openapi-json --title n0bbs > /srv/openapi.json'
	echo you must edit openapi.json around schema before release https://github.com/encode/django-rest-framework/pull/7169
	docker run -it --rm -v ${PWD}:/srv openapitools/openapi-generator-cli generate -g typescript-axios -i /srv/openapi.json -o /srv/ui/src/axios-client
