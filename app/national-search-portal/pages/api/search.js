export default async function handler(req, res){

    const result = await fetch(
        'https://gyujanggak-deployment.ent.us-east-1.aws.found.io/api/as/v1/engines/gyujanggak-search-engine/search?query='
        + encodeURIComponent(req.query.q),
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer search-dyf6r2v7jndspp6r3fpgqh4r'
            },
            
            method: 'GET'
        }
    )

    const resultData = await result.json()

    let results = []
    let contents = []
    let temp_urls = []

    if (resultData.results.length> 0){
        for (var i = 0; i < resultData.results.length; i++){
            const url = resultData.results[i].url.raw
            if(!temp_urls.includes(url)){
                temp_urls.push(url)
                const title = resultData.results[i].title.raw
                const temp_contents = resultData.results[i].main_contents.raw.replace(/<[^>]+>/g, '').split(',')        
                for (var j = 0; j < temp_contents.length; j++){
                    if (temp_contents[j].indexOf(req.query.q) > -1){
                        contents.push(temp_contents[j])
                    }
                }
                
                results.push({"title":title,"url":url,"contents":contents})
            }
        }
    }

    res.status(200).json({data: results})
}
