import type { GreetingProps2 } from "./type2.ts"

function Greeting3({name, age, onClick}:GreetingProps2){
    return (
        <>
            <h2>안녕하세요, {name}</h2>
            <h2>나이 : {age}</h2>

            <button onClick={onClick}>부모 함수 호출</button>
        </>
    );
}

export default Greeting3;