FROM python:3.7-alpine

WORKDIR /code

RUN apk add --no-cache gcc musl-dev linux-headers libxml2 libxslt libxml2-dev libxslt-dev alpine-sdk

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

CMD [ "python", "./archive.py"]
