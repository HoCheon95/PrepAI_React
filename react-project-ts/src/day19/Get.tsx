// User 인터페이스를 생성하세요
// 속성은 id:number, name, email

import { useEffect, useState } from "react";

interface User {
    id:number;
    name:string;
    email:string;
}

function User() {
    // users state 생성
    const [users, setUsers] = useState<User[]>([]);
    // loading state 생성
    const [isLoading, setIsLoading] = useState(false);

    // useEffect 생성(딱 한번 만 실행) 후
    // "https://jsonplaceholder.typicode.com/users" 목록 조회 호출 후 User 타입의 배열로 받아 jsx 문법에서 목록 시각화
    // loading state 꼭 활용

    // GET - 목록 조회
    useEffect(()=>{
        // 비동기 함수 생성
        async function fetchUsers(){
            try{
                // 로딩을 시작하므로 상태를 true로 변경
                setIsLoading(true);

                // 외부 API로 부터 데이터를 가져옴
                const response = await fetch(
                    "https://jsonplaceholder.typicode.com/users"
                );

                // 서버 응답이 정상이 아닌 경우 에러를 던짐
                if(!response.ok){
                    throw new Error("서버 응답 오류 발생!");
                }

                // 받아온 응답 객체를 JSON 데이터로 변환
                const data:User[] = await response.json();
                // 변환된 데이터를 상태에 저장
                setUsers(data);
            } catch(err) {
                // 통신 중 에러가 발생하면 사용자에게 알릴 메시지 설정
                console.error("에러 발생");
            } finally {
                // 성공하든 실패하든 데이터 처리가 끝났으므로 로딩 종료
                setIsLoading(false);
            }
        };
        // 비동기 함수 실행
        fetchUsers();
    }, []);
    
    if(isLoading) {
        return <p>로딩 중.....</p>;
    }

    return (
        <div style={{padding:20}}>
            <h2>사용자 목록</h2>
            <ul>
                {users.map(user=>(
                    <li key={user.id}>
                        {user.name}<br/>
                        {user.email}
                    </li>
                ))}
            </ul>

        </div>
    )
}

export default User;