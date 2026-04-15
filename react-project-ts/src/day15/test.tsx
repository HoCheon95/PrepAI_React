import { add, multi } from "./익명함수.ts"

const a = "안녕!"

function TestJSX(){

    let val1 = add(5,6);
    let val2 = multi(3,4);
    return (
        <div>
            <h1>Test</h1>
            {a}, {1+2} <br/>
            <button onClick={() => {alert(val1)}}>add5,6의 결과 값</button>
            <button onClick={() => {alert(val2)}}>multi3,4의 결과 값</button>
            <button>버튼</button>
        </div>
    )
}

export default TestJSX