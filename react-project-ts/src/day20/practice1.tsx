// Post 인터페이스 생성

import axios from "axios";
import { useEffect, useState } from "react";

// id(number), title(string), userId(number)
interface Post {
    id:number;
    title:string;
    userId:number;
}

export default function PracComp() {
    // 로딩 state, 데이터 state, 에러 state 생성
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string|null>(null);
    // 데이터 state의 제네릭은 인터페이스 배열
    const [pots, setPosts] = useState<Post[]>([]);

    const userId = 2;

    // useEffect 영역
    useEffect(() => {
        // fetchPosts 함수 영역
        const fetchPosts = async () => {
            setIsLoading(true);
            setError(null);
            // try, catch, finally 블록 내 상황에 맞게 코드 작성
            /*            
            params 객체를 사용해서 userId 가 2인 데이터 상세 조회
            "https://jsonplaceholder.typicode.com/posts",
            {
                params:{
                    userId:userId
                },
            }
            */

            try{
                const res = await axios.get<Post[]>(
                    "https://jsonplaceholder.typicode.com/posts",
                    {
                        params:{
                            userId:userId,
                        },
                    }
                );
                setPosts(res.data);
            } catch(err) {
                if(err instanceof Error) setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPosts();
    },[]);

    // 로딩, 에러 state 화면 처리
    if(isLoading) return <p>로딩 중 ....</p>
    if(error) return <p style={{color:"red"}}>에러 발생!!!</p>
    // JSX 로 불러온 데이터 시각화
    return (
        <>
            <ul>
                {pots.map((post)=>(
                    <li key={post.id}>
                        {post.title}{post.userId}
                    </li>
                ))}
            </ul>
        </>
    );

}