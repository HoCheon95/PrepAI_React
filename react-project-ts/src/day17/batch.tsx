import { useState } from "react";

export default function BatchingExample() {
    const [count, setCount] = useState(0);
    const [value, setValue] = useState(100);

    const handleClick = () => {
        /**
         * 배치란?
         * - 리액트가 여러 개의 setState 호출을 모아서 처리하면 한 번만 리렌더링 되도록 최적화하는 기술
         * - 배치가 없다면 setState 개수대로 매번 리렌더링이 발생한다
         * - 하지만 리액트는 동일 이벤트 안에서 발생하는 여러 개의 상태 변경을 모두 수집하고 한 번만 화면을 다시 그린다
         */

        setCount((prev) => prev+1);
        setCount((prev) => prev+1);
        setCount((prev) => prev+1);
        setCount((prev) => prev+100);


        setValue((prev) => prev+500);
    }

    const handleAsyncClick = () => {
        Promise.resolve().then(() => {

            /**
             * 예전(리액트 17)에는 비동기 코드에서 setState를 하면 배치되지 않아
             * setState 호출 시 렌더링이 여러 번 발생했지만
             * React 18 이후, 자동 배치가 된다.
             */

            setCount(prev => prev+1);
            setCount(prev => prev+1);
            setCount(prev => prev+1);
        });

        setTimeout(()=>{
            setCount(prev=>prev+1);
            setCount(prev=>prev+1);
        },0);
    }

    return (
        <>
            <h2>리액트 배치 예제</h2>
            <p>count : {count}</p>
            <p>value : {value}</p>
            <button onClick={handleClick}>업데이트</button>
            <button onClick={handleAsyncClick}>비동기 코드 업데이트</button>
        </>
    )
}