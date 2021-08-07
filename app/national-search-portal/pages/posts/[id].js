import fs from 'fs'
import matter from 'gray-matter'

export default function Post({data, contents}){
    return (
        <>
            <div style={{paddingLeft:20+'px'}}>
                <h1>{data.title}</h1>
                <h2>{data.date}</h2>
                <h3>{data.author.name}</h3>
                <div>{contents}</div>
            </div>
        </>
    )
}

export function getStaticPaths(){
    const postNames = ["profile"]
  
    const params = postNames.map((postName) => ({
        params: { id: postName  }
    })) 

    return {paths: params, fallback: 'blocking'}
}

export async function getStaticProps({ params }){
    const fileName = params.id.replace(".md","")
    const fullPath = "public/posts/"+fileName+'.md'
    const fileContent = fs.readFileSync(fullPath)
    const matterResult = matter(fileContent)
    return {
        props: {
            data : matterResult.data,
            contents : matterResult.content
        },
    }
}