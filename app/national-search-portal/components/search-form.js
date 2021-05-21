import formStyles from '../styles/form.module.css'
import React, { useState } from 'react'

export default function RequestFormAndResult() {

    const [result, setResult] = useState("")
    const [currentTime, setTime] = useState(new Date().toLocaleTimeString())
    const sendRequestData = async event => {
        event.preventDefault() // don't redirect page.
        
        const res = await fetch('/api/search?q=' + encodeURIComponent(event.target.data.value))
        const tempRes = await res.json()

        var resultHtml = ""
        for(var i=0; i<tempRes.data.length; i++){
            resultHtml = resultHtml + "<a href='" + tempRes.data[i].url + "'><div>"+tempRes.data[i].title+"</a><br/>"
            resultHtml = resultHtml + "내용 :"+tempRes.data[i].contents[0]+"</br>"
            resultHtml = resultHtml + "<br/></div>"
        }
        
        document.getElementById('result').innerHTML = resultHtml

        //setResult(tempRes.data)
        setTime(new Date().toLocaleTimeString())

    }

    return (
        <>
            <form onSubmit={sendRequestData} className={formStyles.form}>
                <input id="data" name="data" type="text" autoComplete="data" className={formStyles.searchInput} required />
                <button style={{display:'none'}} type="submit">검색</button>
            </form>
            <div className={formStyles.result} >
                "검색 결과"<br /> "검색 시간":{currentTime} <br/> <br/>
                <div className={formStyles.searchResult}>
                    <div id="result" >
                        검색어를 입력하세요.
                    </div>
                </div>
            </div>
        </>
    )
}