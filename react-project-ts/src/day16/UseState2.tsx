import { useState } from "react";

function UseState2() {
    const [count, setCount] = useState<number>(0);

    const handleIncrease = () => {
        // setState 를 사용하여 한 번 실행 시 2가 증가하도록 하세요
        // setCount(count+2);
        setCount((prev)=>prev + 2);
    };
    return (
        <>
            <div>
                <p>현재 카운트 : {count}</p>
                <button onClick={handleIncrease}>2증가</button>
            </div>
        </>
    );
}

// UseState3 라는 컴포넌트를 만드세요
// 1. state의 타입은 문자열이여만 한다
// 2. 버튼 클릭 시 문자열이 더해지면 된다
// 3. 버튼이 제대로 작동하는 지 확인
export default function UseState3() {
    const [str, setStr] = useState<string>("");

    const stringAdd = () => {
        setStr((prev) => prev+"1");
    };
    return (
        <>
            <div>
                <p>현재 문자열 : {str}</p>
                <button onClick={stringAdd}>문자열 더하기</button>
            </div>
        </>
    );
}

// export default UseState2