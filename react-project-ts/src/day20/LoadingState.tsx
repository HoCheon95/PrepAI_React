import { useEffect, useState } from "react";

interface Todo {
    id:number;
    title:string;
    completed:boolean;
}

export default function TodoListWithLoading() {
    // 데이터 state
    const [todos, setTodos] = useState<Todo[]>([]);
    // 로딩 state
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(()=>{
        const fetchTodos = async () => {
            // 1. 통신 시작 직전에 바로 setIsLoading 을 true 로 토글
            setIsLoading(true);
            try {
                const resp = await fetch (
                    "https://jsonplaceholder.typicode.com/todos?_limit=10"
                );
                const data:Todo[] = await resp.json();
                setTodos(data);
            } catch(err) {
                console.log(err);
            } finally {
                // 통신이 정상/비정상으로 끝나면 무조건 로딩 state 초기화
                setIsLoading(false);
            }
        }
        fetchTodos();
    },[]);

    // API 통신 중 로딩 state 활용
    if(isLoading) return <p>로딩 중 ....</p>;

    return (
        <>
            <ul>
                {todos.map((todo)=>(
                    <li key={todo.id}>
                        {todo.title}{todo.completed? "완료" : "미완료"}
                    </li>
                ))}
            </ul>
        </>
    );
}