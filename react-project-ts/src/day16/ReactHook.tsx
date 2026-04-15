/**
 * 1. Hook 이란?
 * - 함수 컴포넌트 안에서 react의 강력한 기능을 사용할 수 있게 해주는 특별한 함수들
 * - useState, useEffect, useMemo, useCallback, useRef ... 등이 존재
 * 
 * - 훅 등장 이전에는 리액트 기능 사용을 위해 클래스 컴포넌트를 써야 했음
 * - 클래스는 문법이 복잡하고 재사용이 어렵다.
 * - 그래서 훅이 등장하여 함수 컴포넌트만으로도 모든 기능이 사용 가능해졌다
 */

import React, { useEffect, useState } from "react";

export default function HooksExample() {
    /*
    useState : "변하면 화면도 바뀌는 값"을 관리하는 훅

    - 일반 변수는 값이 바뀌어도 화면이 다시 그려지지 않음
    - 하지만 state는 값이 바뀌면 리액트에게 "화면 업데이트 필요!"라고 알려줌
    - state 변경 -> re rendering 발생
     */

    const [count, setCount] = useState(0); // 그냥 const count = 0; 이라고 이해하고 넘어가자


    /*
    useEffect : "컴포넌트의 생명주기" 를 다루는 훅

    - 화면이 처음 렌더링 될 때 실행되는 코드
    - 특정 값이 변경될 때 실행되는 코드
    - 컴포넌트가 사라질 때 실행되는 클린 업 코드 등을 다룬다

    아래 예시는 count 값이 바뀔 때 마다 콘솔에 로그가 출력 된다.
     */
    useEffect(() => {
        console.log(`count 값 변경됨 : ${count}`);

        // clean up 함수
        return () => {
            console.log("count 변경 전 정리작업 실행")
        }
    },[count]);// count 가 바뀔 떄 마다 실행됨


    /**
     * useRef : "변해도 렌더링을 발생시키지 않는 변수" 저장
     * - 예시 : DOM 요소 접근, 렌더링이 유지되어야 하는 값 저장(타이머 ID 등)
     */

    const inputRef = React.useRef<HTMLInputElement>(null);

    const focusInput = () => {
        inputRef.current?.focus();
    };

    /**
     * useMemo : 계산 비용이 큰 값을 "메모이제이션" 하여 성능 최적화
     * 
     * - 특정 값이 변경될 때만 새로 변ㅅ니하고, 그렇지 않으면 이젠 계산 결과를 재사용
     * 
     * 아래 예시는 count2가 변경될 때만 연산이 실행됨
     */

    const [count2, setCount2] = useState(0);

    const expensiveCalculation = React.useMemo(() => {
        console.log("비싼 연산 실행");
        return count2 * 1000;
    },[count2]);

    /**
     * useCallback : 함수 자체를 메모이제이션하는 훅
     * - 컴포넌트가 리렌더링 되어도 동일한 함수 객체를 유지
     * - 자식 컴포넌트에 props로 전달할 때 유용
     */
    const [count3, setCount3] = useState(0);

    const newValue = React.useCallback(() => {
        console.log(`count3 : ${count3}`);
    },[count3]);
    
    return (
        <>
            <div style={{padding:"20px", fontSize:"18px", lineHeight:"1.7"}}>
                <h2>리액트 훅 예시</h2>

                <div>
                    <h3>1. useState 예시</h3>
                    <p>현재 count : {count}</p>
                    <button onClick={() => setCount(count+1)}>count 증가</button>
                </div>

                <div>
                    <h3>2. useRef 예시</h3>
                    <input ref={inputRef} placeholder="여기를 포커스 할게요!"/>
                    <button onClick={focusInput}>포커스 이동</button>
                </div>

                <div>
                    <h3>3. useMemo 예시</h3>
                    <p>현재 count2 : {count2}</p>
                    <button onClick={() => setCount2(count2+1)}>count2 증가</button>
                    <p>비싼 연산 결과 : {expensiveCalculation}</p>
                </div>

                <div>
                    <h3>4. useCallback 예시</h3>
                    <p>count3 : {count3}</p>
                    <button onClick={()=>setCount3(count3+1)}>count3 증가</button>
                    <button onClick={newValue}>newValue 함수 실행</button>
                </div>

            </div>
        </>
    )
}