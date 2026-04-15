import type React from "react";

function SyntheticEventEx () {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        // event 는 브라우저 이벤트가 아니라
        // 리액트가 제공하는 합성 이벤트

        console.log("이벤트 타입 : ", event.type);
        console.log("클릭한 요소 : ", event.target);

        event.preventDefault();
    };

    return (
        <div>
            <h2>합성 이벤트</h2>

            <button onClick={handleClick}>버튼1</button>
            <button onClick={handleClick}>버튼2</button>
            <button onClick={handleClick}>버튼3</button>
        </div>
    );
}

export default SyntheticEventEx;