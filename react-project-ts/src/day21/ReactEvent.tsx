import { useState } from "react";

function EventExample () {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        console.log("버튼 클릭");
        setCount(prev => prev+1);
    };

    const wrongClick = () => {
        console.log("렌더링 중 실행");
    };

    return (
        <div>
            <h2>리액트 이벤트 처리</h2>

            <p>클릭 횟수 : {count}</p>

            <button onClick={handleClick}>
                정상 함수 실행
            </button>

            <br />

            <button onClick={wrongClick}>
                비정상 함수 호출
            </button>
        </div>
    )
}

export default EventExample;