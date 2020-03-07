.PHONY: build
build:
	docker-compose build

.PHONY: up
runserver:
	docker-compose up -d

.PHONY: down
runserver:
	docker-compose down

.PHONY: log
runserver:
	docker-compose log -f

.PHONY: migrate
migrate:
	docker-compose exec app /bin/bash -c 'python manage.py makemigrations && python manage.py migrate'

.PHONY: shell
shell:
	docker-compose exec app /bin/bash
