export default async function handler(req, res){

    const result = await fetch(
        'https://gyujanggak-deployment.ent.us-east-1.aws.found.io \
        /api/as/v1/engines/gyujanggak-search-engine/search?query='
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
    let data
    if (resultData.results.length> 0){
        console.log(resultData.results[0].main_contents)
        data = resultData.results[0].title.raw
    }
    res.status(200).json({data: JSON.stringify(data)})
}
