/*
props
- 부모로 부터 전달 받을 props의 타입 정의
- props 또한 리액티브 값이다
*/

interface ChildProps {
    message:string;
};

function Child({message}:ChildProps){
    // message는 props 이므로 부모의 상태가 바뀌면 자동으로 값이 변경되고 재렌더링 된다.
    return <h2>자식 컴포넌트 메세지 : {message}</h2>;
}

export default Child;