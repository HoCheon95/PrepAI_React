import { useEffect, useState } from "react"

// Todo 인터페이스 생성 id(number), title(string), completed(boolean)
interface Todo {
    id:number,
    title:string,
    completed:boolean
};

export default function TodoListState() {
    // 데이터 state 생성
    const [todo, setTodos] = useState<Todo[]>([]);
    // 로딩 state 생성
    const [isLoading, setIsLoading] = useState(false);
    // 에러 state 생성
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTodos = async () => {
            try{
                // fetch 진행
                // https://jsonplaceholer.typicode.com/todos?_limit=10
                const resp = await fetch (
                    "https://jsonplaceholder.typicode.com/todos?_limit=10"
                );
                // 응답.ok 로 에러 던지기
                if(!resp.ok){
                    // throw new Error(`서버 오류 발생!!! ${resp.status}`);
                    let erroeMessage = "알 수 없는 오류가 발생했습니다.";
                    switch(resp.status){
                        case 400:
                            erroeMessage = "잘못된 요청입니다. 입력 값을 확인해 주세요";
                            break;
                        case 401:
                            erroeMessage = "로그인이 필요합니다";
                            break;
                        case 403:
                            erroeMessage = "접근 권한이 없습니다";
                            break;
                        case 404:
                            erroeMessage = "요청한 데이터를 찾을 수 없습니다";
                            break;
                        case 500:
                            erroeMessage = "서버 오류입니다. 잠시 후 다시 시도해주세요";
                            break;
                    }
                    throw new Error(erroeMessage);
                }
                const data:Todo[] = await resp.json();
                // set 데이터 state
                setTodos(data);
            } catch (err) {
                // 에러 state 활용
                if(err instanceof Error) setError(err.message);
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
        // 통신 시작 직전 행위 입력
        fetchTodos();
    },[]);
    // 로딩 중 일 때 화면
    if(isLoading) return <p>로딩 중 ....</p>
    // 에러 발생 시 화면
    if(error) return <p style={{color:"red"}}>에러 발생!!!</p>
    // JSX
    return (
        <>
            <ul>
                {todo.map((todo)=>(
                    <li key={todo.id}>
                        {todo.title}{todo.completed? "완료":"미완료"}
                    </li>
                ))}
            </ul>
        </>
    );
}