import formStyles from '../styles/form.module.css'
import React from 'react'

export default function RequestFormAndResult() {

    const searchResults = [
        {"key":"블로그","desc":"이 웹사이트 주인의 블로그는 https://blog.naver.com/jyy3k 입니다."},
        {"key":"이름", "desc":"이 웹사이트 주인의 이름은 장용운입니다."},
        {"key": "이름은", "desc": "이 웹사이트 주인의 이름은 장용운입니다." },
        {"key":"관심사","desc":"이 웹사이트 주인의 관심사는 책읽기와 좋은 일을 하는 것입니다."},
        {"key": "관심사는", "desc": "이 웹사이트 주인의 관심사는 책읽기와 좋은 일을 하는 것입니다." },
        {"key":"정치","desc":"정치는 잘 모르고 알고 싶어합니다."},
        {"key": "사랑", "desc": "이 웹사이트 주인이 제일 사랑하는 사람은 러브러브입니다." },
        {"key": "사랑하는", "desc": "이 웹사이트 주인이 제일 사랑하는 사람은 러브러브입니다." }    
    ]

    const handleKeydown = (event) => {
        if (event.code == "Backspace") {
            document.getElementById('result').innerHTML = ""
        }
    }
    
    const sendRequestData = async event => {
        event.preventDefault() // don't redirect page.
        
        var resultHtml = "안녕하세요. 검색해 주셔서 감사합니다."
        var index = 0;
        // for loop로 key를 찾고, 해당 검색 결과를 resulthTML로 전송합니다.
        var searchInputs = document.getElementById('data').value.split(" ")
        
        console.log("Hello")
        console.log(searchInputs.length)
        console.log(searchResults.length)

        for(var i=0;i<searchInputs.length;i++){
            index = 0
            for(var j=0;j<searchResults.length;j++){
                console.log("search : " + searchInputs[i])
                console.log("result : " + searchResults[j].key)
                console.log("search : " + searchInputs[i].length)
                console.log("result : " + searchResults[j].key.length)
                console.log("search : " + typeof(searchInputs[i]))
                console.log("result : " + typeof(searchResults[j].key))
                if(searchInputs[i] == searchResults[j].key){
                    
                    resultHtml = searchResults[j].desc
                    index = 1
                }
            }
            if (index != 0){
                break
            }
        }

        document.getElementById('result').innerHTML = resultHtml
    }

    return (
        <>
            <form onSubmit={sendRequestData} className={formStyles.form}>
                <input id="data" name="data" type="text" autoComplete="data" className={formStyles.searchInput} onKeyDown={handleKeydown} required />
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