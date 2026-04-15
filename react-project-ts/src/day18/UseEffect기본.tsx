/*
1. Effect 함수(콜백 함수)
1) 무엇을 할지를 정의
2) 렌더링이 끝난 후 실행(중요)
3) 부수 효과(데이터 요청, 타이머, 이벤트 등)를 담당

2. 의존성 배열(Dependency Array)
1) 언제 다시 실행할지 결정
2) 배열 안 값이 변경되는 effect 함수 다시 실행
3) 생략 / 빈 배열 / 값 포함 -> 동작이 완전히 달라짐(매우 중요)

기본 구조

useEffect(()=>{
    1. Effect 함수
    
    return () => {
        2. (선택사항) 클린 업 함수
        Effect가 다음에 다시 실행되거나, 컴포넌트가 사라질 때 실행되어 정리 작업 실행
    };
},[의존성 변수들]); 3. 의존성 배열
*/

import { useEffect, useState } from "react";

export default function EffectExample() {
    const [count, setCount] = useState(0);
    const [text, setText] = useState("");

    useEffect(()=>{
        console.log("Effect 함수 실행! 현재 count : ", count);

        document.title = `count : ${count}`;
    }, [count]);

    return (
        <div>
            <h2>useEffect 기본</h2>

            <p>현재 count : {count}</p>
            <button onClick={()=>setCount(prev=>prev+1)}>
                count 증가
            </button>

            <hr />

            <input 
                type="text" 
                onChange={(e)=>setText(e.target.value)}
                placeholder="텍스트 입력"
            />
            <p>입력 값 : {text}</p>
        </div>
    );
}