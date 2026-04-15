import React, { useState } from "react";

function EventTypExample() {
    const [text, setText] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("클릭된 버튼 : ", e.currentTarget);

        alert(`현재 입력된 값은 ${text} 입니다!`);
    };

    return (
        <div style={{padding:20}}>
            <h2>리액트 이벤트 타입 실습</h2>

            <input 
                type="text"
                value={text}
                onChange={handleInputChange}
                placeholder="텍스트를 입력하세요."
            />

            <br /><br />

            <button onClick={handleButtonClick}>
                입력 값 확인
            </button>

            <p>현재 입력 값 : {text}</p>
        </div>
    );
}

export default EventTypExample;