import { useEffect, useState } from "react";

interface Todo {
    id:number;
    title:string;
    completed:boolean;
}

export default function TodoList() {
    /*
    데이터 state
    1. 서버로부터 받아온 결과를 저장
    2. 초기값을 []로 설정해야 데이터가 없어도 안전하다
    3. 데이터 state의 제네릭에 인터페이스를 사용하여 배열 내부 구조를 엄격히 제한
    */
   // 데이터 state
   const [todos, setTodos] = useState<Todo[]>([]);

   useEffect(()=>{
        
        /*
        즉시실행함수 (IIFE)로 변경
        1. 함수명을 지운다
        2. 함수 전체를 ()로 감싼다
        3. 마지막에 (); 붙여주면 끝
        */
        (async () => {
        const response = await fetch (
            "https://jsonplaceholder.typicode.com/todos?_limit=5"
        );
        const data:Todo[] = await response.json();

        setTodos(data);
    })();
    
   },[]);

   return (
    <ul>
        {todos.map((todo)=>(
            <li key={todo.id}>
                {todo.title}{todo.completed? "완료" : "미완료"}
            </li>
        ))}
    </ul>
   );
}