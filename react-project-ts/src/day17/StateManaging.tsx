import { useState } from "react";

export default function MultiStateExample() {
    /**
     * 각각의 상태는 서로 관련이 없으므로 따로 관리라는 것이 가장 안전하고 효율적이다
     * 1) isLogin -> 로그인 여부
     * 2) count -> 카운터 숫자
     * 3) currentTab -> 현재 선택된 탭
     */

    const [isLogin, setIsLogin] = useState(false);
    const [count, setCount] = useState(0);
    const [currentTab, setCuttentTab] = useState("home");

    /**
     * 왜 여러 개로 쪼개야 할까?
     * 1. state 간의 독립성
     *  - 로그인 여부가 바뀐다고 해서 count가 바뀌는 것은 아니다
     *  - 서로 관련 없는 데이트를 한 객체에 모아두면 오히려 관리가 어려워진다
     * 2. 성능 최적화
     *  - 만약 모든 state를 하나의 객체에 넣어 관리하면 한 속성만 바뀌어도 객체 전체가 변경 되었기 때문에
     *    컴포넌트가 다시 렌더링 된다
     *  - state를 나누면 진짜로 바뀐 state 만 렌더링 판단에 영향을 준다 
     */

    const toggleLogin = () => setIsLogin(prev => !prev);
    const increase = () => setCount(prev => prev+1);

    return (
        <div style={{padding:20}}>
            <h2>여러 useState 사용 예시</h2>

            <p>로그인 상태 : {isLogin ? "로그인 완료" : "로그인 안됨"}</p>
            <button onClick={toggleLogin}>
                {isLogin ? "로그아웃" : "로그인"}
            </button>

            <hr />

            <p>카운트 : {count}</p>
            <button onClick={increase}>+1 증가</button>

            <hr />

            <p>현재 탭 : {currentTab}</p>
            <button onClick={() => setCuttentTab("home")}>홈</button>
            <button onClick={() => setCuttentTab("profile")}>프로필</button>
            <button onClick={() => setCuttentTab("settings")}>설정</button>
        </div>
    )
}