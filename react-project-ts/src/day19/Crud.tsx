import { useEffect, useState } from "react";

// 할 일(Todo) 데이터의 타입을 정의하는 인터페이스이다.
interface Todo {
    userId:number;
    id:number;
    title:string;
    completed:boolean;
}

export default function TodoCrudExample() {
    // 할 일 목록을 저장하기 위한 상태이다.
    const [todos, setTodos] = useState<Todo[]>([]);
    // 데이터 로딩 중임을 표시하기 위한 상태이다.
    const [isLoading, setIsLoading] = useState(false);
    // 에러 발생 시 에러 메시지를 담기 위한 상태이다.
    const [error, setError] = useState<string|null>(null);

    // GET - 목록 조회
    // 컴포넌트가 마운트될 때(처음 나타날 때) 데이터를 불러와야 한다.
    useEffect(() => {
        // 별도의 함수 선언 없이 즉시 실행 함수(IIFE)를 사용하여 비동기 로직을 처리
        (async () => {
            try {
                // 로딩을 시작하므로 상태를 true로 변경
                setIsLoading(true);

                // 외부 API로부터 데이터를 가져옴
                const res = await fetch(
                    "https://jsonplaceholder.typicode.com/todos?_limit=5"
                );

                // 서버 응답이 정상이 아닌 경우 에러를 던짐
                if(!res.ok){
                    throw new Error("데이터 조회 실패");
                }

                // 받아온 응답 객체를 JSON 데이터로 변환
                const data: Todo[] = await res.json();
                // 변환된 데이터를 상태에 저장
                setTodos(data);
            } catch(err) {
                // 통신 중 에러가 발생하면 사용자에게 알릴 메시지 설정
                setError("서버 오류 발생!");
                console.log(`서버 오류 발생!! : ${err}`);
            } finally {
                // 성공하든 실패하든 데이터 처리가 끝났으므로 로딩 종료
                setIsLoading(false);
            }
        })(); // 함수를 정의하고 동시에 즉시 호출
    },[]);

    // POST - 새로운 Todo 추가
    const addTodo = async()=>{
        // 서버에 저장할 새로운 할 일 객체 생성
        const newTodo = {
            title:"새로운 할 일",
            completed:false,
            userId:1
        };

        // fetch를 통해 서버에 POST 요청
        const res = await fetch(
            "https://jsonplaceholder.typicode.com/todos",
            {
                method:"POST", // 데이터를 생성할 때는 POST 메서드 사용
                headers:{
                    "Content-Type":"application/json" // 전송하는 데이터가 JSON 형식임을 서버에 알림
                },
                body:JSON.stringify(newTodo) // 자바스크립트 객체를 서버가 읽을 수 있도록 문자열로 변환
                // 직렬화
            }
        );
        // 서버로부터 생성된 결과 데이터를 받아옴
        const createdTodo: Todo =await res.json(); // 파채!

        // 불변성 유지 : 기존 배열을 직접 수정하지 않고 새 배열 생성
        // 기존 목록 뒤에 서버에서 받은 새 데이터를 추가하여 상태 업데이트
        setTodos(prev=> [...prev, createdTodo]);
    };

    // PATCH - 완료 상태 토글
    const toggleTodo = async(id:number) => {
        // 특정 ID를 가진 데이터를 수정하기 위해 경로에 id를 포함하여 요청을 보냄
        await fetch(
            `https://jsonplaceholder.typicode.com/todos/${id}`,
            {
                method:"PATCH", // 일부 데이터만 수정할 때는 PATCH 메서드 사용
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({completed:true}) // 서버는 문자열만 인식하기 때문에 직렬화 후 전송
            }
        );

        // map을 사용하여 특정 ID만 변경
        // 기존 배열을 순회하며 클릭한 ID와 일치하는 항목만 상태 반전
        setTodos(prev =>
            prev.map(todo => 
                
                todo.id === id
                ? {...todo, completed: !todo.completed} // 일치하면 completed 값을 바꾼 새 객체 반환
                : todo // 일치하지 않으면 기존 객체를 그대로 유지
            )
        );
    };

    // DELETE - Todo 삭제
    const deleteTodo = async(id:number) => {
        // 서버에 해당 ID의 데이터를 삭제하라는 요청을 보냄
        await fetch(
            `https://jsonplaceholder.typicode.com/todos/${id}`,
            {method:"DELETE"} // 삭제 시에는 DELETE 메서드 사용
        );

        // 삭제된 아이템을 제외한 나머지 아이템들로만 새로운 배열을 만듬
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };
    
    // 로딩 state, 에러 state 사용한 렌더링 처리
    // 로딩 중일 때는 로딩 메시지를 화면에 보여줌
    if(isLoading) return <p>로딩 중...</p>;
    // 에러가 발생했다면 사용자에게 에러 메시지 표시
    if(error) return <p>{error}</p>;

    return (
        <div style={{padding:20}}>
            <h2>Todo CRUD 실습</h2>
            {/* 버튼을 클릭하면 addTodo 함수가 실행되도록 연결 */}
            <button onClick={addTodo}>Todo 추가(POST)</button>

            <ul>
                {/* todos 배열을 돌면서 각각의 할 일 항목을 리스트 형태로 출력 */}
                {todos.map(todo => (
                    <li key={todo.id}>
                        <span
                            style={{
                                // 완료 상태에 따라 글자에 취소선을 것거나 삭제
                                textDecoration: todo.completed ? "line-through" : "none"
                            }}
                        >
                            {todo.title}
                        </span>
                        {/* 완료 및 삭제 버튼에 각각의 함수를 연결하고 id를 인자로 전달 */}
                        <button onClick={()=>toggleTodo(todo.id)}>완료</button>
                        <button onClick={()=>deleteTodo(todo.id)}>삭제</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}