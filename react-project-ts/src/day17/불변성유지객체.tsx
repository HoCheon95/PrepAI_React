import { useState } from "react";
// address 객체 내 또다른 중첩 객체를 생성하고 그 중첩객체를 수정하는 버튼을 만들어 수정되는 대로 리렌더링이 되게 하시오
interface User {
    name:string;
    age:number;
    address:{
        city:string;
        zip:number;
        test:{
            testName:string;
            testAge:number;
        };
    };
};

export default function UserProfile() {
    const [user, setUser] = useState<User>({
        name:"새로운 이름!",
        age:20,
        address:{
            city:"대전",
            zip:12345,
            test:{
                testName:"testName",
                testAge:100,
            },
        },
    });

    const updateName = () => {
        setUser({...user, name:"업데이트된 이름"});
    };

    const updateCity = () => {
        setUser({
            ...user,
            address:{
                ...user.address, // 중첩 객체도 복사해야 한다
                city:"부산",
            },
        });
    };

    const updateTestName = () => {
        setUser({
            ...user,
            address:{
                ...user.address,
                test:{
                    ...user.address.test,
                    testName:"업데이트된 이름2"
                },
            },
        });
    };

    return(
        <div style={{padding:20}}>
            <h2>사용자 정보</h2>
            <p>이름 : {user.name}</p>
            <p>나이 : {user.age}</p>
            <p>도시 : {user.address.city}</p>
            <p>우편번호 : {user.address.zip}</p>
            <p>중첩객체 이름 : {user.address.test.testName}</p>
            <p>중첩객체 이름 : {user.address.test.testAge}</p>

            <button onClick={updateName}>이름 변경</button>
            <button onClick={updateCity}>중첩객체인 도시 변경</button>
            <button onClick={updateTestName}>중첩객체인 testName 변경</button>
        </div>
    )
}