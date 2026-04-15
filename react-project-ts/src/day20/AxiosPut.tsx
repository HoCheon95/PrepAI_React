import axios from "axios";
import { useEffect, useState } from "react";

interface Todo {
    id:number;
    title:string;
    completed:boolean;
    userId:number;
}

function PutPatch() {
    const [todo, setTodo] = useState<Todo|null>(null);

    useEffect(() => {
        const fetchTodo = async () => {
            const res = await axios.get<Todo>(
                "https://jsonplaceholder.typicode.com/todos/1"
            );
            setTodo(res.data);
        }
        fetchTodo();
    },[]);

    // PUT : 전체 업데이트(보내지 않은 필드는 null로 업데이트 됨)
    const updateWithPut = async() => {
        if(!todo) return;

        const res = await axios.put<Todo>(
            `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
            {
                id:todo.id,
                title:"PUT 전체 수정 제목",
                completed:true,
                userId:todo.userId,
            },
        );
        setTodo(res.data);
    }

    // PATCH : 보내는 데이터만 수정(부분 수정)
    const updateWithPatch = async () => {
        if(!todo) return;

        const res = await axios.patch<Todo>(
            `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
            {
                title:"PATCH 로 제목만 수정",
            },
        );
        setTodo((prev)=>prev? {...prev, ...res.data}:prev);
    };

    if(!todo) return <p>로딩 중 ....</p>;

    return (
        <div style={{padding:20}}>
            <h2>PUT vs PATCH</h2>
            <pre
                style={{
                    background:"#f4f4f4",
                    padding:"10px",
                    marginBottom:"20px",
                }}
            >
                {JSON.stringify(todo, null, 2)}
            </pre>

            <button onClick={updateWithPut}>PUT으로 업데이트</button>
            <button onClick={updateWithPatch}>PATCH로 업데이트</button>
        </div>
    )

}

export default PutPatch;