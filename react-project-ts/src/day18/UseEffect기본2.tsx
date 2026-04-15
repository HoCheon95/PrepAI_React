/* eslint-disable react-hooks/set-state-in-effect */
/*
기본구조

useEffect(()=>{
}, [변수1, 변수2]); 둘 중에 하나만 변해도 실행된다

1) 컴포넌트 마운트 시 1회 실행
2) 이후 의존성 배열 내 변수 값이 하나라도 바뀔 때마다 다시 실행
*/

import { useEffect, useState } from "react";

export default function SearchEffectExample() {
    const [keyword, setKeyword] = useState("");

    const [result, setResult] = useState<string[]>([]);

    useEffect(() =>{
        if(keyword === "") return;

        console.log(`${keyword} 로 검색 요청 실행`);

        const fakeData = [
            `${keyword} 관련 결과1`,
            `${keyword} 관련 결과2`,
            `${keyword} 관련 결과3`,
        ];

        setResult(fakeData);
    },[keyword]);

    return (
        <div>
            <h2>검색 예제</h2>
            {/* 입력 값이 바뀌면 keyword State 변경 */}
            <input 
                type="text"
                value={keyword}
                onChange={(e)=>setKeyword(e.target.value)}
                placeholder="검색어를 입력하시오"
            />

            <ul>
                {result.map((r,i)=>(
                    <li key={i}>{r}</li>
                ))}
            </ul>
        </div>
    )
}