import { useEffect, useState } from "react";

interface User {
    id:number;
    name:string;
}

function UserList() {

    /**
    1. 비동기 상태의 정의

    리액트 앱은 페이지를 새로 고침 하지 않기 때문에
    서버 요청의 "상태"를 우리가 직접 관리해야 한다
    */

    // 데이터를 성공적으로 받아왔을 때 저장할 state
    const [user,setUser] = useState<User[]>([]);

    // API 요청 중인지 확인하는 state
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 에러 발생 시 필요한 state
    const [error, setError] = useState<string|null>(null);


    /*
    2. 컴포넌트 마운트 시 API 호출

    리액트는 SPA 이므로 페이지 전체를 새로고침 하지 않는다
    대신 컴포넌트가 처음 화면에 마운트 될 때 API를 호출한다
    화면이 렌더링 된 후 useEffect 가 실행
    */

    useEffect(()=>{
        // 즉시 실행 함수
        (async()=>{
            try{
                // API 요청 시작 -> 로딩 상태 true 로 토글
                setIsLoading(true);

                const response = await fetch(
                    "https://jsonplaceholder.typicode.com/users"
                );

                if(!response.ok){
                    throw new Error("서버 응답 오류 발생!");
                }

                // 서버 응답은 JSON 문자열이기 때문에 우리가 사용할 수 있도록 자바스크립트 객체화
                const data:User[] = await response.json();

                // 받은 데이터로 setState
                setUser(data);
            } catch (err){
                // 에러 발생 시 setError 를 통해 사용자가 에러를 인식할 수 있도록 화면 렌더링 필요
                // fetch 사용 시 response.ok 로 throw Error 가 없으면 제대로 동작하지 않는다
                setError("사용자 데이터를 불러오지 못했다..");
                console.log(err);
            } finally {
                // 성공이든 실패든 API 호출은 종료 되었기 때문에 로딩 종료
                setIsLoading(false);
            }
        })();
    },[]);

    /*
    3. 비동기 상태에 따른 화면 분기

    REST API 를 제대로 사용한다라는 의미는
    로딩/성공/실패 상태를 명확히 구분해 UI로 표현하는 것
    */

    // 로딩 중
    if(isLoading){
        return <p>로딩 중 입니다.....</p>;
    }

    // 에러 발생
    if(error){
        return <p style={{color:"red"}}>{error}!!!</p>;
    }

    // 성공
    return (
        <div>
            <h2>사용자 목록</h2>
            <ul>
                {user.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    )
}

export default UserList;