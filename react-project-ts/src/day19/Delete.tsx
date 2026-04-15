// Todo 인터페이스를 생성하세요
// id(number), title(string)

import { useState } from "react";

interface Todo {
    id:number;
    title:string;
}

function TodoDelete() {
    // todos state를 생성하고 타입은 Todo의 배열입니다.
    // 더미데이터 3개 이상을 초기값으로 설정하세요
    const [todos, setTodos] = useState<Todo[]>([
        {id:1, title:"할 일1"},
        {id:2, title:"할 일2"},
        {id:3, title:"할 일3"},
    ]);

    const deleteTodo = async(id:number) => {
        // delete Api 호출 : https://jsonplaceholder.typicode.com/todos 뒤에 아이디를 붙어야함
        await fetch(
            `https://jsonplaceholder.typicode.com/todos/${id}`,
            {
                // delete는 method 속성만 필요함
                method:"DELETE",
            }
        );

        // setState 실행
        setTodos(prevTodos => 
            prevTodos.filter(todo => todo.id !== id)
        );
    };

    return (
        <div>
            <h2>할 일 목록</h2>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        {todo.title}
                        <button onClick={()=>deleteTodo(todo.id)}>삭제</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default TodoDelete;