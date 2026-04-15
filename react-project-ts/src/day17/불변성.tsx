/* eslint-disable react-hooks/immutability */
import { useState } from "react";

// name과 age가 속성으로 interface를 생성하고 그것을 활용해 useState를 생성하세요
// ================ 인터페이스 시작 ================
interface Person {
    name:string;
    age:number;
}
// ================ 인터페이스 종료 ================

// ================ state 영역 시작 ================
export default function ImmutabilityExample(){
    // 배열 state
    const [numbers, setNumbers] = useState<number[]>([1,2,3]);

    // 객체 state
    const [user,setUser] = useState<Person>({name:"김철수", age:20});
    // ================ state 영역 종료 ================


    // ================ 함수 영역 시작 ================
    // 배열 불변성 예시
    const addNumber = () => {
        // numbers.push(4); 원본 state 를 직접 수정하면 안돼!!!

        // 올바른 방식(기존의 state를 복제하여 사용)
        setNumbers([...numbers, numbers.length+1]);
    };

    // 객체 불변성 예시
    const increaseAge = () => {
        // user.age = user.age+1; 얘도 원본 state에 직접 접근 중.. 절대 안됨

        setUser({
            ...user,  // 기존 속성 복사
            age: user.age+1,  // 바꾸고 싶은 값만 수정
            // 이름도 수정해 보시오
            name: user.name = "김홍식",
        });
    };

    const wrongUpdate = () => {
        numbers.push(4);
        setNumbers(numbers);
    };

    // ================ 함수 영역 끝 ================

    return (
        <>
            <div style={{padding:20}}>
                <h2>불변성 기본 예시</h2>

                <h3>1. 배열 state</h3>
                <p>현재 배열 : {JSON.stringify(numbers)}</p>
                <button onClick={addNumber}>숫자 추가</button>
                <button onClick={wrongUpdate}>잘못된 숫자 추가</button>

                <hr />

                <h3>2. 객체 state</h3>
                <p>이름 : {user.name}</p>
                <p>나이 : {user.age}</p>
                <button onClick={increaseAge}>나이 추가</button>

            </div>
        </>
    )
}