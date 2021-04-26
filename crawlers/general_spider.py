from scrapy.spiders import Spider
from scrapy.http import Request
from scrapy.http.response.html import HtmlResponse
from scrapy.linkextractors import LinkExtractor
from scrapy.exporters import JsonLinesItemExporter
from scrapy import Item
from scrapy import Field
import json

class Url(Item):
    url = Field(serializer=str)
    title = Field(serializer=str)

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
            r.meta.update(link_text=link.text)
            with open('/code/frontera/examples/general-spider/url.json', 'ab+') as binary_file:
                jsonLine = JsonLinesItemExporter(binary_file)
                self.logger.info("=======")
                response_text = response.css('title::text').get()
                if((response_text not in "None") & (link.url not in "facebook") & (link.url not in "instagram")):
                    self.logger.info("inner if statement")
                    urls = Url(url=link.url,title=response_text.encode('utf-8'))
                jsonLine.export_item(urls)
            yield r
        
