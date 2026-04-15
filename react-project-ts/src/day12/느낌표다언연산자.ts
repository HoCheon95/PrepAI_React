// 1. null 또는 undefined가 될 수 있는 변수
let userName:string | null = null;

// 2. 느낌표 단언 연산자(!) 사용
// userName이 절대 null 이나 undefined 가 아님을 컴파일러에게 알려줌
// 런타임에서는 실제 값이 null 이면 에러 발생 가능
// console.log(userName!.length);


// 3. 안전하게 사용하는 예시
userName = "이름이 있다!";
console.log(userName!.length);


// 4. 함수에서 활용
function printLength(str?: string|null){
    // str이 null 또는 undefined가 아님을 단언
    console.log(str!.length);
}

printLength("Hello!");

