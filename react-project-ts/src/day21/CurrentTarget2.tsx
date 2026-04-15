import type React from "react"

const EventTargetExample = () => {
    /*
    1. 이벤트 위임 & 자식 요소 확인
    e.target 사용
    */

    const handleListClick = (e:React.MouseEvent<HTMLUListElement>) => {
        console.log(`e.target : ${e.target}`);
        console.log(`e.currentTarget : ${e.currentTarget}`);

        // 실제 클릭된 요소(li, span 등)
        if(e.target instanceof HTMLLIElement){
            alert(`클릭된 항목 : ${e.target.textContent}`);
        }
    };

    /*
    2. button/form/input 자리
    이벤트가 걸린 요소 자체를 다룰 때
    e.currentTarget 사용
    */

    const handleButtonClick = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.currentTarget.disabled = true;
        alert(`버튼 클릭됨(비활성화 처리)`);
    };

    // 3. form submit 처리
    const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        alert(`입력 값 : ${formData.get("username")}`);
    };

    return (
        <div style={{padding:20}}>
            <h2>e.target 과 currentTarget</h2>
            <ul
                onClick={handleListClick}
                style={{border:"1px solid #ccc", padding:18}}
            >
                <li>사과</li>
                <li>바나나</li>
                <li>포도</li>
            </ul>

            <hr />

            <button onClick={handleButtonClick}>
                버튼 클릭 시 비활성화
            </button>

            <hr />

            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="이름 입력" />
                <button type="submit">
                    제출
                </button>
            </form>
        </div>
    );
}

export default EventTargetExample;