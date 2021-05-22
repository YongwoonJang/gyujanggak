import formStyles from '../styles/form.module.css'
import React, { useState } from 'react'

export default function RequestFormAndResult() {

    const sendRequestData = async event => {
        event.preventDefault() // don't redirect page.
        
        const res = await fetch('/api/search?q=' + encodeURIComponent(event.target.data.value))
        const tempRes = await res.json()

        var resultHtml = ""
        
        if (tempRes.data.length == 0) {
            resultHtml = "검색 결과가 없습니다."
            document.getElementById('result').style.textAlign = "center";
        
        }else{
                for(var i=0; i<tempRes.data.length; i++){
                    if (tempRes.data[i].contents.length != 0) {
                        resultHtml = resultHtml + "<div><a href='" + tempRes.data[i].url + "'>"+tempRes.data[i].title+"</a><br/>"
                        resultHtml = resultHtml + "내용 :"+tempRes.data[i].contents[0]+"</br>"
                        resultHtml = resultHtml + "<br/></div>"

                    } else {
                        resultHtml = resultHtml + "<div><a href='" + tempRes.data[i].url + "'>" + tempRes.data[i].title + "</a><br/></div>"

                    }
                }
            
        
        }

        document.getElementById('result').innerHTML = resultHtml
    }

    return (
        <>
            <form onSubmit={sendRequestData} className={formStyles.form}>
                <input id="data" name="data" type="text" autoComplete="data" className={formStyles.searchInput} required />
                <button style={{display:'none'}} type="submit">검색</button>
            </form>
            <div className={formStyles.result} >
                <div className={formStyles.searchResult}>
                    <div id="result" >
                        <br/>
                    </div>
                </div>
            </div>
        </>
    )
}