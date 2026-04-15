import { useState } from "react";

export default function AsyncStateProblem () {
    const [count, setCount] = useState(0);

    const handleWrongUpdate = () => {
        /**
         * 잘못된 방식 (비동기성 문제 발생)
         * setCount(count + 1)을 여러 번 호출하면,
         * count는 과거의 값을 기억하고 있기 때문에 모두 같은 값으로 계산된다.
         * 
         * 즉, 아래 세 줄은 모두 count+1로 계산됨
         * 리액트는 setState를 배치로 묶기 때문에 최종적으로 count는 1만 증가함
         */
        setCount(count + 1);
        setCount(count + 1);
        setCount(count + 1);
    }

    const handleCorrectUpdate = () => {
        /**
         * 올바른 방식(함수형 업데이트)
         * 이전 상태(prev)를 리액트가 직접 전달해주는 setState의 비동기성에 영향을 받지 않는다
         * 이전 값을 기반으로 안전하게 누적 증가 가능
         */
        setCount(prev=>prev+1);
        setCount(prev=>prev+1);
        setCount(prev=>prev+1);
    }

    return (
        <>
            <div style={{padding:20}}></div>
            <h2>비동기성 문제 예시</h2>

            <p>현재 count : {count}</p>

            <button onClick={handleWrongUpdate}>잘못된 업데이트</button>

            <br />

            <button onClick={handleCorrectUpdate}>올바른 업데이트</button>

        </>
    );
}

// 컴포넌트 파일을 하나 생성하고
// 문자열 state를 생성 후 문자열이 계속 업데이트 되는 버튼을 만들어 정상 작동되게 하세요