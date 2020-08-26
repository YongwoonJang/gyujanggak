FROM python:3
WORKDIR /code
ENV JAVA_HOME /usr/lib/jvm/java-1.7-openjdk/jre
RUN apt-get update && apt-get install -y g++ default-jdk vim
RUN pip install konlpy tensorflow sklearn
COPY . .
