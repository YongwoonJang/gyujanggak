FROM ubuntu:20.04
WORKDIR /code
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64/bin/java
ENV FLASK_APP=/code/src/app.py
ENV FLASK_RUN_HOST=0.0.0.0
RUN apt-get clean && apt-get update 
RUN DEBIAN_FRONTEND="noninteractive" apt-get install -y \ 
  python3 \ 
  python3-dev \
  python3-pip \ 
  libxml2 \ 
  openjdk-8-jdk \
  curl \ 
  vim \
  && rm -rf /var/lib/apt/lists/*
COPY requirements.txt requirements.txt
RUN pip3 install --upgrade pip3 & pip3 install -r requirements.txt
CMD ["bash <(curl -s https://raw.githubusercontent.com/konlpy/konlpy/master/scripts/mecab.sh)"]
EXPOSE 5000
COPY . .
