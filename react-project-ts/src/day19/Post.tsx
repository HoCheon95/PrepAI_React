// Post 인터페이스를 생성하고
// id(number), title(string) 속성을 넣으세요

interface Post {
    id:number;
    title:string;
}

import type React from "react";
import { useState } from "react";

function PostForm () {

    // posts state 생성(Post 인터페이스의 배열 타입)
    const [posts, setPosts] = useState<Post[]>([]);
    // title state 생성. 초기값 : "" 
    const [title, setTitle] = useState("");

    const handleSubmit = async(e:React.FormEvent) => {
        e.preventDefault(); // 새로 고침 방지

        // post 요청 작성
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts",
            // 필요한 정보 작성
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({title})
            }
        );

        // 응답데이터를 자바스크립트 객체로 변환
        const newPost:Post = await response.json();

        // 불변성 유지하며 state 업데이트
        setPosts(prev=>[...prev, newPost]);

        // 입력창 초기화
        setTitle("");
    }

    return (
        <div>
            <h2>게시글 작성</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" 
                    value={title}
                    onChange={e=>setTitle(e.target.value)}
                    placeholder="제목 입력"
                />
                <button type="submit">등록</button>
            </form>

            <ul>
                {posts.map((post)=>(
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default PostForm;