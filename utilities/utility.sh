#/bin/bash

clean_up() {
  
	# Perform program exit 
	echo "utility bash cleaned up..."
	kill -9 $(ps -ef | grep "frontera" | awk '{print $2}')
	kill -9 $(ps -ef | grep "scrapy" | awk '{print $2}')
	kill -9 $(ps -ef | grep "sleep" | awk '{print $2}')
	rm -rf ./*.sqlite
	rm -rf queue.*
	rm -rf nohup.out
	rm -rf ./general/url.json
	exit

}

trap clean_up SIGHUP SIGINT SIGTERM EXIT

while true; do
echo "Check whether processes need to be start"
	if [ $(ps -f | grep "frontera" | awk '{print NF}' | wc -l) -eq 0 ] 
	then 
		echo "It is needed, Processes are starting ..."

		nohup python3 -m frontera.contrib.messagebus.zeromq.broker 0>/code/frontera/examples/general-spider/log/zeromq.log 1>&0 2>&0 &
		sleep 3

		nohup python3 -m frontera.utils.add_seeds --config config.dbw --seeds-file seeds_es_smp.txt
		sleep 3

		nohup python3 -m frontera.worker.strategy --config config.sw 0>/code/frontera/examples/general-spider/log/strategy.log 1>&0 2>&0 &
		sleep 3 

		nohup python3 -m scrapy crawl general 0>/code/frontera/examples/general-spider/log/crawl.log 1>&0 2>&0 &
		sleep 3 

		nohup python3 -m frontera.worker.db --no-incoming --config config.dbw --partitions 0 0>/code/frontera/examples/general-spider/log/db.log 1>&0 2>&0 &
		sleep 3 

		echo "Processes are started ..."
	fi
echo "End of period"
sleep 3
done
