import { useEffect, useState } from "react";

interface Todo {
    id:number;
    title:string;
    completed:boolean;
}

export default function TodoListWithError() {
    const [todo, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 에러 : state : 초기 값 null, 에러 발생 시 사용자에게 보여줄 메세지 저장
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTodos = async () => {
            // 통신 시작
            // 로딩 시작 및 이젠 에러 초기화(중요!!!)
            setIsLoading(true);
            setError(null);

            try{
                const resp = await fetch(
                    "https://jsonplaceholder.typicode.com/tosfsdfsdos?_limit=10"
                );
                if(!resp.ok) {
                    throw new Error(`서버 오류 발생!!! ${resp.status}`);
                }
                const data:Todo[] = await resp.json();
                setTodos(data);
            } catch(err) {
                // 에러 state 활용
                if(err instanceof Error) setError(err.message);
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTodos();
    },[]);

    if(isLoading) return <p>로딩 중 ....</p>;
    // 에러 state 활용
    if(error) return <p style={{color:"red"}}>에러발생!!!</p>;

    return (
        <>
            <ul>
                {todo.map((todo)=>(
                    <li key={todo.id}>
                        {todo.title}{todo.completed? "완료" : "미완료"}
                    </li>
                ))}
            </ul>
        </>
    )


}