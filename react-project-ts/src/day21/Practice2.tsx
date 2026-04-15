import type React from "react";
import { useEffect, useState } from "react";

// Post 인터페이스 생성
// id:number, title:string
interface Post {
    id:number;
    title:string;
}


const PostManager = () => {
    // Post 타입 배열의 posts state 생성
    const [posts, setPosts] = useState<Post[]>([]);

    // 문자열 타입의 title state 생성
    const [title, setTitle] = useState("");

    // loading state 생성
    const [isLoading, setIsLoading] = useState(false);

    // error state 생성
    const [error, setError] = useState<string | null>(null);

    // useEffect와 axios를 사용하여 초기 데이터 5개 호출
    // https://jsonplaceholder.typicode.com/posts?_limit=5
    // 데이터 통신 중 loading, error state 적절히 사용해주기
    useEffect (() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try{
                const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
                if (!res.ok) throw new Error("데이터를 불러오는데 실패했습니다.");
                const data = await res.json();
                setPosts(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Form 제출 함수 생성
    // e: React.FormEvent
    // 제출 시 새로고침 방지
    // 🔴 Form 제출 함수 생성
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();  // 새로고침 방지해야 한다.
        if (!title.trim()) return;  // 빈 값은 추가하지 않는다.

        const newPost: Post = {
            id: Date.now(),  // 임시 고유 ID를 생성한다.
            title: title,
        };

        setPosts([newPost, ...posts]);  // 새로운 포스트를 배열 맨 앞에 추가한다.
        setTitle("");  // 입력창을 비워준다.
    };
    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, id:number) => {
        // 이벤트 전파 방지 코드 작성
        e.preventDefault();
        e.stopPropagation();

        setPosts(posts.filter(post=>post.id !== id));
        alert(`${id} 번 포스트 삭제 완료!`);
    }

    return (
        <div style={{ padding: 20, maxWidth: 500 }}>
            {/* 🔴 form 태그와 입력창을 생성한다. */}
            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                <input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="새 포스트 제목"
                />
                <button type="submit">추가</button>
            </form>

            {/* 🔴 데이터를 리스트로 시각화한다. */}
            <ul>
                {posts.map((post) => (
                    <li key={post.id} style={{ marginBottom: 10 }}>
                        {post.title} 
                        <button 
                            onClick={(e) => handleDelete(e, post.id)} 
                            style={{ marginLeft: 10 }}
                        >
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

}

export default PostManager;