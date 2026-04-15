/**
JSX 기본 개념(Javascript Syntax extension)

1) JSX는 JS 안에서 HTML/XML 구조를 표현하는 확장 문법
2) JSX는 리액트 엘리먼트를 생성하는 핵심 문법'
3) JSX는 UI 구조를 직관적으로 작성할 수 있게 한다.
4) 브라우저는 JSX를 이해하지 못하므로 바벨/TSX 가 JS 코드로 변환한다(트랜스파일링)
 */

import React from "react";
import TestJSX from "./test.tsx";


// JSX 를 사용한 기본 UI 구조 예시
const elementJSX = (
    <div>
            <h1>Hello JSX!@</h1>
            <p>자바스크립트 내에 HTML 구조를 넣는 확장 문법이다.</p>
    </div>
);

// JSX는 리액트 엘리먼트를 만드는 문법이다
const titleJSX = <h2>JSX는 리액트 엘리먼트를 생성한다</h2>

// JSX는 UI 구조를 직관적으로 표현하여 가독성이 좋다
function WelcomeJSX(){
    return (
        <div>
            <h3>안녕하세요!</h3>
            <button>로그인</button>
        </div>
    );
}

// JSX를 사용하지 않은 예시(가독성이 좋지 않다.)
function WelcomeWithoutJSX(){
    return React.createElement(
        "div",
        null,
        React.createElement("h3",null,"환영합니다!"),
        React.createElement("button",null,"로그인"),
    );
}

export default function App2() {
    return (
        <div style={{padding:20}}>
            <h1>JSX 는 처음이지?</h1>
            {/* JSX UI */}
            {elementJSX}

            {/* JSX로 만든 엘리먼트 */}
            {titleJSX}

            <h2>컴포넌트 비교</h2>

            <h3>JSX 사용 컴포넌트</h3>
            <WelcomeJSX/>

            <h3>JSX 없이 작성된 컴포넌트</h3>
            <WelcomeWithoutJSX/>
            
            <TestJSX />
        </div>
    );
}



// 네이밍 컨벤션에 맞게 .tsx 파일을 생성하고 JSX 문법을 사용하여 컴포넌트를 만들어서
// Jsx.tsx 메인 컴포넌트에 import 하시오(h1 태그와 button 태그 사용)
