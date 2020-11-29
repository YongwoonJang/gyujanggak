# gyujanggak

## Index

* 수집한 언어를 분석하기 위한 기본 툴을 제공합니다.

## Installation

* Docker를 사용합니다. 약 2.28GB정도 필요합니다.

  * Windows

    * 기본적으로 Powershell ISE를 기반으로 아래 명령을 수행했습니다.

    * Docker를 다운로드한 후 설치 [Docker hub](https://www.docker.com/get-started)

    * WSL 2 설치 - 설치 방법은 docker를 설치한 후 나옵니다.  

    * WSL 2 업데이트 [WSL2 Update](https://docs.microsoft.com/en-us/windows/wsl/wsl2-kernel)

    * Dockerfile이 존재하는 파일 위치로 이동 후 docker build -t '원하는 이름' 적습니다 .

    * docker run -it --name '원하는 이름' '위에서 적은 원하는 이름, 곧 이미지 이름'을 적어 실행합니다.

    * python code를 작성한 후 import gyujanggak을 사용합니다.

  * Ubuntu

    * apt-get install docker

    * Dockerfile이 존재하는 파일 위치로 이동 후 docker build -t  '원하는 이름' 적습니다. .

    * bash <(curl -s https://raw.githubusercontent.com/konlpy/konlpy/master/scripts/mecab.sh) 명렁어를 수행합니다.

    * docker run -it --name '원하는 이름' '위에서 적은 원하는 이름, 곧 이미지 이름'을 적어 실행합니다.

    * python code를 작성한 후 import gyujanggak을 사용합니다.

## Functions

* 글자를 숫자로 바꾸어주는 함수

* The function converts from a quesion to number then saves "words - numbers" pairs as tokenizer.

* The function for crawling data to be premise.

* The function for crawling data to be opinion.

* The function for learning relation between premises and opinions

* The function for predicting a opinion of a premise.

## Maintainer

* 장용운 Yongwoon Jang (royalfamily89@gmail.com)
