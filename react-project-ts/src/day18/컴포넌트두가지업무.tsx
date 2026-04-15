import { useEffect, useState } from "react";

export default function Example() {
    const [count, setCount] = useState(0);

    // 부업 : 사이드 이펙트(렌더링이 끝난 후 실행) --2
    useEffect(()=>{ // 다시실행 --6
        console.log("컴포넌트가 화면에 렌더링 됐음");

        const timer = setInterval(()=>{
            console.log(`현재 count : ${count}`);
        }, 1000);

        // 정리 작업(클린 업 함수)
        // 컴포넌트가 사라지거나 effect 가 다시 실행되기 전 실행
        return () => { // --클린업 함수 실행 --6
            clearInterval(timer);
            console.log("타이머 정리");
        }
    },[count]); // count가 바뀔 때마다 부업을 다시 수행 --count 변경으로 인한 useEffect 실행 --4

    // 본업 : 화면 렌더링 --1, 클릭 --3
    return (
        <div>
            <h2>카운트 : {count}</h2>
            <button onClick={()=>setCount(pre=>pre+1)}>증가</button>
        </div>
    );
}