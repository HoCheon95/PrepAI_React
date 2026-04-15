/* eslint-disable @typescript-eslint/no-explicit-any */
/*
그럼 왜 useEffect 내에서 async를 사용해야 하나?

useEffect 내부에서 async 함수를 정의하고 await를 사용하는 궁극적인 목표는 
비동기 API통신을 동기적인 코드처럼 순차적이고 읽기 쉬운 방식으로 작성하여
개발 편의성을 높이기 위함

이것이 바로 async / await 문법이 자바스크립트에 도입된 핵심 목적이며, 
useEffect 내부에서 이 패턴을 사용하는 이유를 세가지로 정리할 수 있다

1. 코드 흐름의 순차성
가장 큰 이유는 가독성과 흐름 제어
-> 비동기를 동기처럼 쓰기 위함

비동기 작업은 본래 콜백 함수 .then() 을 연속적으로 사용하여 처리해야 한다

async/await 를 사용하면 코드가 위에서 아래로 순차적으로 실행되는 것처럼 보이므로,
개발자가 비동기 작업의 논리적 흐름을 직관적으로 파악하고 디버깅 하기 쉽다

2. 오류 처리의 용이성
async/await 를 사용하면 비동기 로직에서 발생하는 오류를 일반 동기 코드처럼 try...catch 문으로 감싸서 처리할 수 있다

콜백 방식에서는 오류를 잡기 위해 각 then 체인에 catch를 붙이거나, 내부에서 오류를 던지는 복잡한 작업이 필요했지만
async/await 는 이를 동기 코드 수준으로 단순화한다

**useEffect가 여러 개 있을 때 실행 순서
-> 코드 내에서 가장 먼저 선언 된 useEffect 부터 순서대로 effect 함수가 실행된다
*/

import { useEffect, useState } from "react";

function AsyncEffectExample() {
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(()=>{
        /*
        IIFE(즉시 실행 함수)
        - 선언과 동시에 실행되는 함수
        - async/await 사용 가능
        */
       (async()=>{
        try{
            console.log("api 요청 시작");

            const response = await fetch(
                "https://jsonplaceholder.typicode.com/posts"
            );
            const data = await response.json();

            setPosts(data.slice(0,5));
        } catch(error){
            console.error(error);
        }
       })(); // <- 즉시 실행 함수의 특징
    },[]); // 최초 렌더링 시 1회만 실행

    return(
        <div style={{padding:20}}>
            <h2>게시글 목록</h2>
            
            <ul>
                {posts.map((post)=>(
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default AsyncEffectExample;