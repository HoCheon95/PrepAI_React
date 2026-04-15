import { useState } from "react";

export default function TodoList() {
    const [todos, setTodos] = useState<string[]>([]);

    const addTodo = () => {
        const newTodo = "새 일감";

        /**
         * setTodos([...todos, newTodo])
         * 지금 방식도 사실 위험할 수 있다
         * 이유
         * 1) 리액트는 setState를 비동기적으로 처리하며 여러 업데이트를 배치함
         * 2) 이벤트가 연속으로 발생하면 todos 변수가 오래된 값을 참조할 가능성이 생김
         * -> 버튼을 매우 빠르게 여러 번 클릭하면 todos 값이 최신 상태가 아닐 수도 있다
         * -> 이런 상황을 "Stale State(오래된 상태)" 문제라고 한다.
         * 
         * 
         * 안전한 방식 : 함수형 업데이트
         * - prev는 리액트가 보장하는 가장 최신의 state
         * - 즉, 여러 클릭이 동시에 일어나도 prev는 항상 최신 상태를 받는다
         * - 따라서 안전하게 최신 상태 기반으로 배열을 추가할 수 있다
         * 
         * 
         * 불변성 유지
         * - 스프레드 연산자를 사용하여 새로운 배열을 생성한다
         * - 기존 배열을 수정하지 않고, 새로운 배열을 만들어 저장하므로 리액트의 불변성 원칙을 지킨다
         */

        setTodos(prev => [...prev, newTodo]);
    }

    return (
        <div>
            <button onClick={addTodo}>할 일 추가</button>
            <ul>
                {todos.map((t)=> (
                    <li key={t}>{t}</li>
                ))}
            </ul>
        </div>
    );
    

}


