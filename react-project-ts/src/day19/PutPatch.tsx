// Todo 인터페이스 생성
// id(number), title(string), completed(boolean)

import { useState } from "react";

interface Todo {
    id:number;
    title:string;
    completed:boolean;
}

function TodoList() {
    // todos state 생성
    // 타입은 Todo의 배열
    // 초기 값은 3개 이상
    const [todos, setTodos] = useState<Todo[]>([
        {id:1, title:"할 일1", completed:false},
        {id:2, title:"할 일2", completed:true},
        {id:3, title:"할 일3", completed:false},
    ]);

    const toggleTodo = async(id:number) => {
        // https://jsonplaceholder.typicode.com/todos 뒤에 id(path parameter) 가 들어가야 함
        await fetch(
            `https://jsonplaceholder.typicode.com/todos/${id}`,
            {
                // url 입력 후 필요한 정보 입력
                method:"PATCH",
                headers:{
                    "Content-Typd":"application/json"
                },
                body:JSON.stringify({completed:true})
            }
        );

        // state 업데이트(어떤 방식으로든 해보기)
        setTodos(prev => 
            prev.map(todo =>
                todo.id === id
                ? {...todo, completed: !todo.completed}
                : todo
            )
        );
    };

    return (
        <div>
            <h2>할 일 목록</h2>
            <ul>
                {todos.map((todo)=>(
                    <li key={todo.id}>
                        <label>
                            <input type="checkbox" checked={todo.completed} onChange={()=>toggleTodo(todo.id)} />
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TodoList;