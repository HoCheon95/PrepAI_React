import { useState } from "react";
import { Link } from "react-router-dom";

function CounterLinkVsAnchor() {
    const [count, setCount] = useState(0);

    return (
        <div style={{padding:20}}>
            <h2>Link vs a 태그 비교</h2>

            <p>현재 카운트 : {count}</p>

            <button onClick={()=>setCount(prev=>prev+1)}>
                +1
            </button>

            <hr />

            <h3>a 태그 ( 전체 새로고침 발생)</h3>
            {/* 클릭 시
            1. 브라우저가 서버로 새 HTML 요청
            2. 리액트 앱 전체 초기화
            3. count 값이 0으로 리셋됨 */}
            <a href="/about">About 페이지로 이동(a태그)</a>

            <h3>Link(SPA 방식)</h3>
            {/* 클릭 시
            1. preventDefault 로 기본 동작 차단(새로고침)
            2. history.pushState로 주소만 변경
            3. 해당 Route 컴포넌트만 교체
            4. count 값 유지 */}
            <Link to="/about">About 페이지로 이동(Link)</Link>
        </div>
    )
}

export default CounterLinkVsAnchor;