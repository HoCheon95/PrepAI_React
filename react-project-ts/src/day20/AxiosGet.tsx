import axios from "axios";
import { useEffect, useState } from "react";

interface Post {
    id:number;
    title:string;
    userId:number;
}

export default function AxiosQueryParams() {
    const [posts, setPosts] = useState<Post[]>([]);

    // 로딩 state, 에러 state 를 추가하고 useEffect 내 로직도 그에 맞게 변경하세요.
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string|null>(null);

    const userId = 1;

    useEffect(()=>{
        const fetchPosts = async () => {
            try{
                setIsLoading(true);
                setError(null);
                // 비추천 방식 : url 에 문자열을 직접 이어 붙이면 오타 위험, 가독성 하락
                // const url = `/posts?userId=${userId}&sort=desc`;

                // 권장 방식(Axios Params)
                // Axios 가 자동으로 ?userId=1 형태로 변환
                const response = await axios.get<Post[]>(
                    "https://jsonplaceholder.typicode.com/posts",
                    {
                        params:{
                            userId:userId,
                        },
                    }
                );
                setPosts(response.data);

            } catch(err){
                if(err instanceof Error) setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPosts();
    },[]);

    if(isLoading) return <p>로딩 중 ....</p>
    if(error) return <p style={{color:"red"}}>에러 발생!!!</p>

    return(
        <>
            <ul>
                {posts.map((post)=>(
                    <li key={post.id}>
                        {post.title}{post.userId}
                    </li>
                ))}
            </ul>
        </>
    );
}