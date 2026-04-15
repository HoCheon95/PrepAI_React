/*
useEffect 는 동기방식(위에서 아래로 실행)으로 실행된다
컴포넌트 를 생성하고 useEffect 5개를 생성하여
해당 컴포넌트를 루트컴포넌트에 import 해서 브라우저를 열고
개발자 도구를 열었을 때 콘솔 탭에 아래 문자열이 출력되도록 하세요
"useEffect 실행 - 1"
"useEffect 실행 - 2"
"useEffect 실행 - 3"
"useEffect 실행 - 4"
"useEffect 실행 - 5"

count state 를 생성하고
count state 를 증가시키는 버튼을 만들고
버튼 클릭시 useEffect는 영향이 없어야 합니다
*/

import { useEffect, useState } from "react";

export default function Effect() {
    const [count, setCount] = useState(0);

    useEffect(()=>{
        console.log("useEffect 실행 - 1");
    },[]);
    useEffect(()=>{
        console.log("useEffect 실행 - 2");
    },[]);
    useEffect(()=>{
        console.log("useEffect 실행 - 3");
    },[]);
    useEffect(()=>{
        console.log("useEffect 실행 - 4");
    },[]);
    useEffect(()=>{
        console.log("useEffect 실행 - 5");
    },[]);

    return (
        <div>
            <h2>useEffect 기본</h2>

            <p>count : {count}</p>
            <button onClick={()=>setCount(prev=>prev+1)}>count 증가</button>
            
        </div>
    )
}