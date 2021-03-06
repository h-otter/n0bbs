FROM python:3.8 AS APP

WORKDIR /srv/app
COPY /app/requirements.txt /srv/app

RUN pip install -r requirements.txt
COPY app /srv/app
RUN python manage.py collectstatic --noinput

# TODO: asgiなどもう一回見直す
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


FROM node:13 AS UI

WORKDIR /srv/ui

COPY ui/package.json /srv/ui
COPY ui/package-lock.json /srv/ui
COPY ui/yarn.lock /srv/ui
RUN yarn install

COPY ui /srv/ui
RUN yarn run build


FROM nginx

COPY --from=UI /srv/ui/build /usr/share/nginx/html
COPY --from=APP /srv/app/static /usr/share/nginx/html/api/static
COPY production/etc/nginx/conf.d /etc/nginx/conf.d
