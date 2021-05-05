# gyujanggak

## Index

* 검색한 문자에 해당하는 국정 자료를 JSON으로 반환 합니다. [소스|<https://likms.assembly.go.kr>]

* (현재 개발 중...)검색된 국정 자료를 브라우저를 통해 검색할 수 있도록 합니다. (Vercel framework를 통해서 제공)

* 최종 목표는 "XXX안건에 대하여 말한 의원은 누구야?" 질문했을 때 "000가 말했고 xxx라 했습니다."로 응답되게 하는 것입니다. (api는 elastic search를 통해서 제공)

## 언어 환경 

* Python3

* JavaScript

## High level Design

![gyujanggak HLD /architecure/gyujanggakHLA.svg 참고](https://github.com/YongwoonJang/gyujanggak/blob/master/architecture/gyujanggakHLA.svg)

## 사용방법 

* Dockerfile이 존재하는 파일 위치로 이동 후 docker compose up을 사용합니다. .

1. cd .

2. docker compose up

3. curl로 데이터 검색을 합니다. [Elastic Search Link|<https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html>]

```bash
    curl -X GET "{원하는 IP로 요청}:9200/_search?pretty" -H 'Content-Type: application/json' -d'
    {
    "query": {
        "regexp": {
        "user.id": {
            "value": "k.*y",
            "flags": "ALL",
            "case_insensitive": true,
            "max_determinized_states": 10000,
            "rewrite": "constant_score"
        }
        }
    }
    }
    '
```

## Functions

* JSON 형식의 데이터로 바꾸어줍니다.

* Docker compose up으로 Elastic search 웹서비스 운영.

## Maintainer

* 장용운 Yongwoon Jang (royalfamily89@gmail.com)
