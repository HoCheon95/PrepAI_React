/* eslint-disable react-hooks/immutability */
import { useState } from "react";

interface User {
    name:string;
    age?:number;
}

export default function WrongMutationExample() {
    const [numbers, setNumbers] = useState([1,2,3,4,5]);

    const [user,setUser] = useState<User>({name:"김영희", age:10});

    const addNumberWrong = () => {
        numbers.push(6);
        setNumbers(numbers);
    }

    const changeIndexWrong = () => {
        numbers[0] = 99999;
        setNumbers(numbers)
    }

    const changeUserWrong = () => {
        user.name = "춘향이";
        setUser(user);
    }

    const deleteAgeWrong = () => {
        delete user.age;
        setUser(user);
    }

    return (
        <>
            <h2>잘못된 state 업데이트 예시</h2>

            <p>numbers:{JSON.stringify(numbers)}</p>
            <button onClick={addNumberWrong}>잘못된 push</button>
            <button onClick={changeIndexWrong}>잘못된 인덱스 변경</button>

            <p>user : {JSON.stringify(user)}</p>
            <button onClick={changeUserWrong}>잘못된 객체 수정</button>
            <button onClick={deleteAgeWrong}>잘못된 delte</button>
        </>
    )
}