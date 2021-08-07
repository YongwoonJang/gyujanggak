import fs from 'fs'
import matter from 'gray-matter'
import parse from 'html-react-parser'

export default function Post({data, contents}){
    const content = parse(contents)
    return (
        <>
            <div style={{paddingLeft:20+'px'}}>
                <h1>{data.title}</h1>
                <h2>{data.date}</h2>
                <h3>{data.author.name}</h3>
                <div>{content}</div>
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
    const fullPath = "public/posts/"+params.id+".md"
    const fileContent = fs.readFileSync(fullPath)
    
    const matterResult = matter(fileContent)
    return {
        props: {
            data : matterResult.data,
            contents : matterResult.content
        },
    }
}