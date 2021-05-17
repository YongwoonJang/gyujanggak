from scrapy.spiders import Spider
from scrapy.http import Request
from scrapy.http.response.html import HtmlResponse
from scrapy.linkextractors import LinkExtractor
from scrapy.exporters import JsonLinesItemExporter
from scrapy import Item
from scrapy import Field
from bs4 import BeautifulSoup
import requests
import json
import configparser
from elastic_enterprise_search import AppSearch

class GeneralSpider(Spider):
    name = 'general'
    
    def __init__(self, *args, **kwargs):
        super(GeneralSpider, self).__init__(*args, **kwargs)
        self.le = LinkExtractor()

    def parse(self, response):
        if not isinstance(response, HtmlResponse):
            return
        
        for link in self.le.extract_links(response):
            r = Request(url=link.url)
            self.insertToElastic(url = link.url)
            yield r
    
    def insertToElastic(self, **kwargs):
        if (kwargs["url"] != ""):
            page = requests.get(kwargs["url"])
            soup = BeautifulSoup(page.text, 'html.parser')
            contents_key_value = {}

            # URL
            contents_key_value["url"] = kwargs["url"]

            # 제목 
            contents_key_value["title"] = soup.title.text 

            # 내용 
            contents=[content for content in soup.stripped_strings]
            filtered_contents = []
            for content in contents:
                if ("function" not in content) & ("-" != content) & (">" != content) & ("jsMain" not in content) & ("Copyright" not in content):
                    filtered_contents.append(content)

            if len(contents) > 289:
                del filtered_contents[147:290]
                del filtered_contents[0:93] 

            contents_key_value["main_contents"] = ",".join(filtered_contents)

            # 목적 아래 위치에서만 아래 형식으로 데이터 확인이 가능함.
            if "https://www.assembly.go.kr/assm/assemact/council/council0101/assmSchCal/assemScanCalDetail.do" in kwargs["url"] :
                
                contents_key_value["purpose"] = soup.find_all("tr","general")[0].contents[1].contents[1].contents[0]
                subject_html = soup.find_all("tr", "subject")
                for i in range(0, len(subject_html[0].find_all("th"))):
                    contents_key_value[subject_html[0].find_all("th")[i].text.strip()] = subject_html[0].find_all("td")[i].text.strip()
                contents_key_value[subject_html[1].a.text] = subject_html[1].a['href']

            
            # INSERT DATA TO Elastic search
            config = configparser.ConfigParser()
            config.read('/code/general-spider/general/spiders/example.ini')
            app_search = AppSearch(
                config['ELASTIC']['elastic_search'],
                http_auth=config['ELASTIC']['private_key']
            )

            res = app_search.index_documents(
                engine_name=config['ELASTIC']['engine_name'],
                documents=[contents_key_value]
            )

            print(res)

