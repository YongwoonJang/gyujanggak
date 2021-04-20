# container를 수행합니다. 
1. docker container start gyujanggak_web_1 

# container에 bash shell로 접속합니다.
1. docker exec -it gyujanggak_web_1 bash 
 
# 아래 경로로 들어갑니다. 
1. cd ./frontera/examples/general-spider/

# utility.sh를 위치시키고, 아래 명령어를 수행합니다.
1. ./utility.sh 1>./utility.log &  
