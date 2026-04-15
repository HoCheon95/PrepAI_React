//1. API 응답 구조 정의 (인터페이스, 타입)

import { useEffect, useState } from "react";

// 서버에서 내려온 JSON 구조와 반드시 1:1로 일치해야 한다.

interface Post {
    userId:number;
    id:number;
    title:string;
    body:string;
}

function JsonFetchExample() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(()=>{
        // 2. fetch 요청
        fetch("https://jsonplaceholder.typicode.com/posts")
            .then((res)=>{
                // 여기서 아직 JSON은 문자열
                // 콘솔에서 찍어보면 response 객체 이다
                console.log(`응답 객체`);
                console.log(res);
                return res.json(); // 파채로 만듦
            })
            .then((data)=>{
                // 이제 data는 문자열이 아니라 자바스크립트 객체 상태
                console.log('파싱된 데이터');
                console.log(data);
                setPosts(data.slice(0,3));
            });
    },[]);

    // 3. POST 예제
    const createPost = async() => {
        const newPost = {
            title:"JSON 테스트",
            body:"Header가 없으면 서버는 해석을 못함",
            userId:1,
        };

        // 현재 자바스크립트 객체 상태기 때문에 서버가 이해활 수 있도록 문자열로 변환(직렬화)
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts",
            {
                method:"POST",
                headers:{
                    // 이 헤더가 없으면 서버는 그냥 문자열로 인식하게 된다.
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(newPost),
            }
        );
        const result = await response.json();
        console.log("POST 결과");
        console.log(result);
    };

    return (
        <div>
            <h2>JSON & 타입스크립트 핵심 예제</h2>

            <button onClick={createPost}>POST 전송</button>

            <ul>
                {posts.map((post)=>(
                    <li key={post.id}>
                        <strong>{post.title}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default JsonFetchExample;