import { useEffect, useState } from "react";

type Route = "home" | "about" | "profile";

// 메인 컴포넌트
const Router2 = () => {
    // 1. 현재 경로를 state로 관리
    // url 과 ui를 동기화 하기 위한 state
    const [route, setRoute] = useState<Route>("home");

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace("#/", "");

            // 주소에 따라 route 결정
            if(hash === "about" || hash === "profile") {
                setRoute(hash);
            } else {
                setRoute("home");
            }
        };

        // 최초 진입 시 한번만 실행
        handleHashChange();

        // hash 변경 감지
        window.addEventListener("hashchange", handleHashChange);

        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        };
    },[]);

    const renderPage = () => {
        switch (route) {
            case "home" :
                return <Home/>;
            case "about" :
                return <About/>;
            case "profile" :
                return <Profile/>;
            default:
                return <Home/>;
        }
    };

    return (
        <div style={{padding:20}}>
            <h1>라이브러리 없는 라우팅</h1>

            {/* 네비게이션 */}
            <nav style={{marginBottom:20}}>
                <a href="#/home">Home</a> | {" "}
                <a href="#/about">About</a> | {" "}
                <a href="#/profile">Profile</a> | {" "}
            </nav>

            <p>
                현재 URL : <strong>{window.location.hash}</strong>
            </p>

            <hr />

            {renderPage()}
        </div>
    );
}

const Home = () => (
    <div>
        <h2>Home</h2>
        <p>홈 화면 입니다.</p>
    </div>
);

const About = () => (
    <div>
        <h2>About</h2>
        <p>이 앱은 라우팅 개념을 설명하기 위한 예시입니다.</p>
    </div>
);

const Profile = () => (
    <div>
        <h2>Profile</h2>
        <p>사용자 프로필 화면입니다.</p>
    </div>
);

export default Router2;