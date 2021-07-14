export default async function handler(req, res){

    //Find data. using regex. 
    let archive = []
    let results = []

    let position = archive.search(req.query.q)
    console.log("api/search.js, 8th line")

    if (position < 0) {
        results.push({"title":"JYU IS BACK","url":"https://blog.naver.com/jyy3k","contents":"Yongwoon is back"})
    
    }else{
        results.push({"title":"국정정보검색의 재시작","url": "https://blog.naver.com/jyy3k","contents": "Yongwoon is back" })
    
    }

    res.status(200).json({data: results})
}
