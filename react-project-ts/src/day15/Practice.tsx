/**
 * Hello 라는 컴포넌트를 생성 후
 * name이 라는 변수를 JSX 내에서 사용하여 화면에 출력되도록 해보세요
 * 루트 컴포넌트에 import
 */
function Hello() {
    const name = "홍길동"
    return (
        <div>
            <h1>Hello {name}</h1>
        </div>
    );
}

export default Hello;