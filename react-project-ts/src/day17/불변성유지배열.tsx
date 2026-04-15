import { useState } from "react";

interface Todo {
    id:number;
    text:string;
};

export default function TodoExample() {
    const [todos, setTodos] = useState<Todo[]>([
        {id:1, text:"리액트 공부하기"},
        {id:2, text:"자바 공부하기"},
        {id:3, text:"AWS 공부하기"},
        {id:4, text:"파이썬 공부하기"},
        {id:5, text:"SQL 공부하기"},
    ]);

    const addTodo = () => {
        const newTodo:Todo = {
            id:Date.now(),
            text:"새로운 공부",
        };

        setTodos([...todos, newTodo]);
    };

    const deleteTodo = (id:number) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    }

    const updateTodo = (id:number) => {
        setTodos(
            todos.map((todo) => 
                todo.id === id ? {...todo, text:"업데이트된 공부"} : todo
            )
        );
    };

    return (
        <>
            <h2>불변성을 지키며 배열 업데이트 하기</h2>

            <button onClick={addTodo}>할 일 추가</button>

            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        {todo.text}
                        <br /><br />
                        <button onClick={()=>updateTodo(todo.id)}>수정</button>
                        <button onClick={()=>deleteTodo(todo.id)}>삭제</button>
                    </li>
                ))}
            </ul>
        </>
    );
}
