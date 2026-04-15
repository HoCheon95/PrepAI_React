import { useEffect, useRef, useState } from "react";

export default function SideEffectExample() {
    const [user, setUser] = useState<string>("");

    const [seconds, setSeconds] = useState<number>(0);

    const titleRef = useRef<HTMLHeadingElement | null>(null);

    // 사이드 이펙트 1 : 데이터 가져오기(Fetching) - 서버와의 통신
    useEffect(()=>{
        fetch("https://jsonplaceholder.typicode.com/users/1")
            .then(res => res.json())
            .then(data => {
                setUser(data.name);
            });
    },[]); // [] -> 컴포넌트 최초 마운트 시 한 번만 실행

    // 사이드 이펙트 2 : 타이머 설정 (구독)
    useEffect(()=>{
        const timer = setInterval(()=>{
            setSeconds(prev=>prev+1);
        }, 1000);

        // 클린업 함수 실행
        return () => {
            clearInterval(timer);
        };
    },[]);

    // 사이드 이펙트 3 : 로컬 스토리지
    useEffect(()=>{
        localStorage.setItem("username", user);
        const userName = localStorage.getItem("username");
        console.log(userName);
    }, [user]); // user가 변경될 때만 실행

    // 사이드 이펙트 4 : DOM 직접 조작
    useEffect(()=>{
        if(titleRef.current){
            titleRef.current.style.color = "blue";
        }
    },[]);

    // 본업 : 화면 렌더링
    return (
        <div>
            <h2 ref={titleRef}>사이드 이펙트 예시</h2>
            <p>사용자 이름 : {user || "불러오는 중..."}</p>
            <p>경과 시간 : {seconds}초</p>

            <button onClick={()=>setUser("홍길동")}>
                이름 변경(State 변경)
            </button>
        </div>
    )
}