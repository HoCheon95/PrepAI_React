/* eslint-disable react-hooks/immutability */
/**
 * 일반 변수와 state의 차이를 쉽게 이해할 수 있는 컴포넌트
 * 
 * 1. 일반 변수는 컴포넌트가 다시 렌더링 될 때마다 초기화된다.
 * 2. state는 값이 유지되며, 값이 바뀔 때 마다 리렌더링을 발생 시킨다
 */

import { useState } from "react";

export default function VariableVsStateExample(){
    // state : 리렌더링이 일어나도 값이 유지되고, 값이 바뀌면 화면을 업데이트함
    const [ counterState, setCounterState ] = useState(0);

    // 일반 변수 : 컴포넌트 내부에서 선언된 변수 -> 리렌더링 시 다시 초기화 된다.
    let counterVar = 0;

    /**
     * 일반 변수 증가 함수
     * 버튼을 눌러 counterVar++ 을 해도 화면이 업데이트 되지 않는다
     * -> 리액트는 이 변수가 UI 와 관련있다고 판단하지 않기 때문
     */

    const increaseVar = () => {
        counterVar += 1;
        console.log(`일반 함수 : ${counterVar}`);
    };

    /**
     * state 증가 함수
     * setCounterState() 가 호출되면 컴포넌트를 다시 렌더링하고, 화면도 최신 값으로 자동 업데이트 됨(리렌더링)
     */
    const increaseState = () => {
        setCounterState(counterState+1);
    };

    return (
        <>
            <div style={{padding:"20px", fontSize:"18px"}}>
                <h2>일반 변수 vs state 차이 예제</h2>

                {/* 일반 변수 표시 */}
                <div style={{marginBottom:"16px"}}>
                    <p>일반 변수 값 : {counterVar}</p>
                    <button onClick={increaseVar}>일반 변수 증가</button>
                </div>

                {/* state 표시 */}
                <div>
                    <p>state 값 : {counterState}</p>
                    <button onClick={increaseState}>state 증가</button>
                </div>

                <hr />

                <h3>핵심 정리</h3>
                <h4>일반 변수는 컴포넌트가 다시 렌더링 될 때마다 초기화 된다. UI 업데이트와는 무관하며
                    값이 바뀌어도 화면이 변하지 않는다.
                    <strong>state는 값이 유지되며, 바뀌는 순간 컴포넌트를 재렌더링하여 화면을 업데이트 한다.</strong>
                </h4>
            </div>
        </>
    );
}