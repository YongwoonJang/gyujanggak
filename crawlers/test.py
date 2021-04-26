from elasticsearch import Elasticsearch 
from bs4 import BeautifulSoup
import requests

index = 0
url = "https://www.assembly.go.kr/assm/assemact/council/council0101/assmSchCal/assemScanCalDetail.do?committee_id=2005110000003&gubun=CMMTT&board_id=2006011000180&record_id=2021040061317&no=252"
page = requests.get(url)
soup = BeautifulSoup(page.text, 'html.parser')

contents_key_value = {}

# 제목 
contents_key_value["제목"] = soup.title.text 

# 내용 
contents=[content for content in soup.stripped_strings]
filtered_contents = []
for content in contents:
    if ("function" not in content) & ("-" != content) & (">" != content) & ("jsMain" not in content) & ("Copyright" not in content):
        filtered_contents.append(content)


del filtered_contents[147:290]
del filtered_contents[0:93] 

contents_key_value["주요내용"] = ",".join(filtered_contents)

if "https://www.assembly.go.kr/assm/assemact/council/council0101/assmSchCal/assemScanCalDetail.do" in url :
    
    contents_key_value["목적"] = soup.find_all("tr","general")[0].contents[1].contents[1].contents[0]
    subject_html = soup.find_all("tr", "subject")
    for i in range(0, len(subject_html[0].find_all("th"))):
        contents_key_value[subject_html[0].find_all("th")[i].text.strip()] = subject_html[0].find_all("td")[i].text.strip()
    contents_key_value[subject_html[1].a.text] = subject_html[1].a['href']


es = Elasticsearch("127.0.0.1:9200")
res = es.index(index='national-index', body=contents_key_value)
