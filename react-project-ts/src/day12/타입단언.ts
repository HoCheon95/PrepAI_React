/* eslint-disable @typescript-eslint/no-explicit-any */
// 1. 타입 단언 이란?
// 컴파일러에게 "내가 이 값의 타입을 알고있다" 라고 알려 주는 것!
// 타입 추론을 넘어서 직접 타입을 지시할 수 있음

// 2. 앵글 브라켓 문법
let someVal:any = "안녕 타입스크립트!";
// let strLength1:number = (<string>someVal).length;
// console.log(strLength1);


// 3. as 문법 -- 요놈만 알아도 된다!
let strLength2:number = (someVal as string).length;
console.log(strLength2);


// 4. DOM 요소에서 타입 단언
const inputEl = document.getElementById("myInput") as HTMLInputElement;
inputEl.value = "타입 단언으로 값 설정";


// 5. 주의 사항
// 실행은 되는데 이런식으로 타입 단언을 절대 사용해서는 안된다!
const num = "123" as unknown as number;
console.log(num);