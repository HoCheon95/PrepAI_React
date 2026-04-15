/**
 * TodoList2 컴포넌트를 생성하고
 * 속성이 최소 3개인 interface를 생성하여
 * 생성 된 인터페이스를 사용하여 제네릭이 객체 배열인 useState를 만들고
 * 클릭 시 객체가 추가되는 버튼을 만드세요.(prev 사용!!)
 */

import { useState } from "react";

interface Todo {
  id: number;
  name: string;
  age: number;
}


function TodoList2() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, name: "김철수", age: 20 },
    { id: 2, name: "김영희", age: 21 },
    { id: 3, name: "김영수", age: 22 },
  ]);

  const addTodo = () => {
    const newTodo:Todo = {
        id:todos.length,
        name:"새 할일",
        age:100,
    };

    setTodos((prev) => [...prev, newTodo]);
  };

  return (
    <>
      <button onClick={addTodo}>추가</button>
      <ul>
        {todos.map((t) => (
            <li key={t.id}>{t.name} {t.age}</li>
        ))}
      </ul>
    </>
  )
}


export default TodoList2