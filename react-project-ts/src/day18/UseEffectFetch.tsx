import { useEffect, useState } from "react";

// 1. 가져올 데이터의 타입을 먼저 인터페이스로 정의
interface Post {
    userId : number;
    id:number;
    title:string;
    body:string;
}

export default function PostFetcher(){
    // 2. state 정의 : 초기 값은 빈 배열로 설정하고, 타입은 Post 배열로 명시
    const[posts, setPosts] = useState<Post[]>([]);
    const[isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        // 비동기 함수를 useEffect 내부에서 정의
        // 클린업 및 동기화 문제 때문에 async/await 를 직접 useEffect의 콜백으로 사용하지 않고,
        // 내부에서 선언하고 즉시 호출하는 패턴을 사용하는 것이 일반적이다.
        const fetchData = async () => {
            try{
                // limit = 10 인 api 를 호출하고 시간화 해주는 컴포넌트를 작성하시오
                const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10`);

                if(!response.ok){
                    throw new Error(`HTTP error! status : ${response.status}`);
                }

                // 3. 응답 데이터를 정의한 Post[] 타입으로 받는다
                const data: Post[] = await response.json();
                setPosts(data);
            } catch (error) {
                console.error(`데이터 로딩 중 오류 발생 : ${error}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    },[]); // 빈 배열 : 컴포넌트 마운트 시 단 한 번 실행

    // 4. 로딩 상태를 활용한 조건부 렌더링
    if(isLoading){
        return <div>로딩 중 .....</div>;
    }
    return(
        <div style={{padding:20}}>
            <h2>최근 포스트 목록 ({posts.length} 개)</h2>
            {posts.map((p)=>(
                // 5. 타입 안전성 : 인터페이스 생성으로 인하여 속성에 안전하게 접근 가능
                <div key={p.id} style={{
                    borderBottom: '1px solid #eee',
                    marginBottom: '10px',
                    padding: '10px'
                }}>
                    <h3 style={{color:'#333'}}>{p.title}</h3>
                    <p>작성자 : {p.userId}</p>
                    <p>{p.body}</p>
                </div>
            ))}
        </div>
    );
}