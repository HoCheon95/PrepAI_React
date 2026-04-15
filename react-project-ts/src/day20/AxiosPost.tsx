import axios from "axios";
import { useState } from "react";

interface Todo {
    id:number;
    title:string;
    completed:boolean;
    userId:number;
}

// 서버로 전송할 데이터 타입
interface TodoPayload {
    title:string;
    completed:boolean;
    userId:number;
}

function TodoPostEx() {
    const [todos, setTodos] = useState<Todo[]>([]);

    const createTodo = async() => {
        // JSON.stringify 필요 없음
        const newTodo:TodoPayload = {
            title:"Axios Post 학습하기",
            completed:false,
            userId:1,
        }

        try{
            const resp = await axios.post<Todo>(
                "https://jsonplaceholder.typicode.com/todos",
                newTodo,
                {
                    headers:{
                        "Content-Type":"application/json",
                    }
                }
            );
            setTodos((prev)=>[...prev, resp.data])
        } catch(err) {
            console.log(err);
        }
    };

    return (
        <div style={{padding:20}}>
            <h2>Todo 생성(POST)</h2>

            <button onClick={createTodo}>
                TODO 추가
            </button>

            <hr />

            <ul>
                {todos.map((todo)=>(
                    <li key={todo.id}>
                        {todo.title}(userId : {todo.userId})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoPostEx;