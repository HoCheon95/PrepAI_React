import { useState } from "react";

interface User {
    firstName:string;
    lastName:string;
    email:string;
};

export default function UserProfile() {
    /**
     * user 객체 하나로 응집된 state 처리
     * - 하나의 setUser 로 모든 프로필 정보를 업데이트 할 수 있음
     * - 리액트는 user 객체가 변경될 때 한 번만 리렌더링 처럼
     */

    const [user, setUser] = useState<User>({
        firstName:"길동",
        lastName:"홍",
        email:"ewe@email.com",
    });

    const updateFirstName = () => {
        // firstName을 업데이트하는 setState를 완성하세요
        setUser(prev => ({
            ...user,
            firstName:"홍박사",
        }));
    };
    const updateEmail = () => {
        // email을 업데이트 하는 setState를 완성하세요
        setUser(prev => ({
            ...user,
            email:"123123@naver.com"
        }));
    };

    return (
        <div>
            <h2>사용자 프로필</h2>
            <p>이름 : {user.lastName}{user.firstName}</p>
            <p>이메일 : {user.email}</p>

            <button onClick={updateFirstName}>이름 변경</button>
            <button onClick={updateEmail}>이메일 변경</button>
        </div>
    )
}