import axios from "axios";
import { useEffect, useState } from "react";

interface Todo {
    id:number;
    title:string;
    completed:boolean;
    userId:number;
}

function TodoDelete() {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        const fetchTodos = async () => {
            const res = await axios.get<Todo[]>(
                "https://jsonplaceholder.typicode.com/todos?_limit=5"
            );
            setTodos(res.data);
        }
        fetchTodos();
    },[]);

    const deleteTodo = async (todoId:number) => {
        try {
            await axios.delete(
                `https://jsonplaceholder.typicode.com/todos/${todoId}`
            );
            setTodos((prev)=>prev.filter((todo) => todo.id !== todoId));
        } catch(err) {
            console.error(err);
        }
    };

    return(
        <div style={{padding:20}}>
            <h2>axios Delte 실습</h2>
            <ul>
                {todos.map((todo)=>(
                    <li key={todo.id} style={{marginBottom:8}}>
                        {todo.title}
                        <button
                            style={{marginLeft:10}}
                            onClick={()=>deleteTodo(todo.id)}
                        >삭제</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoDelete;