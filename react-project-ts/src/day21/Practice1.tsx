import React, { useState } from "react";

function NameInput () {
    // 문자열 타입인 name state 생성
    const [name, setName] = useState("");

    // React.ChangeEvent<HTMLInputElement> 타입의 이벤트 객체를 사용 하여
    // 이름 변경 함수를 생성하세요 (name state 변경)
    const handelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    // React.MouseEvent<HTMLButtonElement> 타입의 이벤트 객체를 사용 하여
    // name state 를 초기화 하세요
    // 함수 생성
    const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
        setName("");
    };

    // JSX
    // 이름 입력을 위한 input 생성
    // 이름 초기화를 위한 button 생성
    // 이름 state를 시각화 할 삼항연산자를 이용한 p 태그 생성
    return (
        <div>
            <h2>이름 입력</h2>
            <input 
                type="text" 
                value={name}
                onChange={handelNameChange}
                placeholder="이름을 입력하세요."
            />

            <br /><br />

            <button onClick={handleReset}>
                초기화
            </button>

            <p>현재 이름 : {name}</p>
        </div>
    )

}

export default NameInput;