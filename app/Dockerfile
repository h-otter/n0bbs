FROM python:3.8

WORKDIR /srv/app
COPY requirements.txt /srv/app

RUN pip install -r requirements.txt
COPY . /srv/app

# TODO: asgiなどもう一回見直す
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
