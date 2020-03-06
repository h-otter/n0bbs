.PHONY: build
build:
	docker-compose build

.PHONY: runserver
runserver:
	docker-compose up -d

.PHONY: migrate
migrate:
	docker-compose exec app /bin/bash -c 'python manage.py makemigrations && python manage.py migrate'

.PHONY: shell
shell:
	docker-compose exec app /bin/bash
