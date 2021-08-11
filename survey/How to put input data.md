# How to put response data

## Desire

If I want to put response data to screen then

## Requirement(Desire require)

1. Get response data

2. Transfer response data to screen

## Condition(Requirement should be containing)

- Get response date using fetch

```javascript
    const sendRequestData = async event => {
            event.preventDefault() // don't redirect page.
            const res = await fetch('/api/search/?q='+encodeURIComponent(event.target.data.value))
            const tempRes = await res.json()
            setResult(tempRes.data)
            setTime(new Date().toLocaleTimeString())
    }
```

- Transfer response data to screen

```javascript
    //fetch data and insert data to "id" result
    const res = await fetch('/api/search?q=' + encodeURIComponent(event.target.data.value))
        const tempRes = await res.json()

        var resultHtml = ""
        for(var i=0; i<tempRes.data.length; i++){
            resultHtml = resultHtml + "<a href='" + tempRes.data[i].url + "'><div>"+tempRes.data[i].title+"</a><br/>"
            resultHtml = resultHtml + "내용 :"+tempRes.data[i].contents[0]+"</br>"
            resultHtml = resultHtml + "<br/></div>"
        }
        
        document.getElementById('result').innerHTML = resultHtml
    
    //Express Result
    <div id="result" >
        검색어를 입력하세요.
    </div>
```

## Reference

- [React.js document](https://reactjs.org/docs/state-and-lifecycle.html)