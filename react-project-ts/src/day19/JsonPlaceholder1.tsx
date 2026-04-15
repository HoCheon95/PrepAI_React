import { useEffect, useState } from "react";

interface Post {
    id:number;
    title:string;
    body:string;
}

function PostList () {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        (async() => {
            setIsLoading(true);
            // https://jsonplaceholder.typicode.com/posts
            // url을 활용하여 setPosts 를 하는 코드를 만드세요.
            // 받은 데이트를 파싱하는 것이 핵심!
            // fetch를 사용하고 await를 사용

            const response = await fetch(
                "https://jsonplaceholder.typicode.com/posts"
            );
            const data:Post[] = await response.json(); // 파채

            setPosts(data);
            setIsLoading(false);
        })();
        // 아까 배웠던 IIFE 함수로 변경
    },[]);

    return (
        <div>
            <h2>게시글 목록</h2>
            {isLoading&&<p>로딩중......</p>}

            <ul>
                {posts.slice(0,5).map((post)=>(
                    <li key={post.id}>
                        <strong>{post.title}</strong>
                        <p>{post.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PostList;