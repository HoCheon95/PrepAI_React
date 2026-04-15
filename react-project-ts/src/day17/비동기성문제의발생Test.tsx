// 컴포넌트 파일을 하나 생성하고

import { useState } from "react";

// 문자열 state를 생성 후 문자열이 계속 업데이트 되는 버튼을 만들어 정상 작동되게 하세요
export default function SateExample() {
    const [str, setStr] = useState("초기 값");

    const handleStrUpdate = () => {
        setStr(prev =>prev+str.length);
    }

    return (
        <>
            <h2>Test 문제</h2>
            <p>현재 문자열 : {str}</p>
            <button onClick={handleStrUpdate}>문자열 업데이트</button>
        </>
    )
}