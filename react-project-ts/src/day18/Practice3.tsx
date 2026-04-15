import { useEffect, useState } from "react";

/*
문자열 state를 생성하고
문자열 state를 변경하는 button을 만드세요
state가 변경 할 때 마다 console.log 를 출력하세요(useEffect)
*/
export default function UseEffectTest2(){
    const [str, setStr] = useState("");

    useEffect(()=>{
        console.log(`현재 count : ${str}`);
    },[str]);

    return(
        <>
            <p>현재 count :{str}</p>
            <button onClick={()=>setStr(prev=>prev+1)}>버튼</button>
        </>
    )
}