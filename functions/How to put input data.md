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
    //Import state
    import React, { useState } from 'react'

    //Use state
    const [result, setResult] = useState("")
    
    
    //Set Result
    setResult(tempRes.data)
    setTime(new Date().toLocaleTimeString())
    
    //Express Result
    <div className={formStyles.result}>
        "검색 결과"<br /> "검색 시간":{currentTime} <br/> {result}
    </div>

```

## Reference

- [React.js document](https://reactjs.org/docs/state-and-lifecycle.html)