// 1. 콜백 함수
// 콜백으로 전달되는 함수의 타입을 "콜 시그니처" 로 정의하면 안전하다.

// 콜백 함수의 타입 정의(콜 시그니처) 정의
type Callback = (value:number) => void;

// 콜백을 인자로 받는 함수
function processValue(value:number, callback:Callback) {
    console.log("처리 시작...");
    callback(value); // 콜백 실행
}

processValue(10, (num) => {
    console.log(`콜백 실행됨 num : ${num}`);
});



// 2. 중첩 함수
// 함수 내 또 다른 함수를 선언하는 방식
// 별다른 제약 없이 함수 타입만 명확히 하면 사용 가능하다.
function outerFunction(msg:string) {
    console.log(`외부 함수 실행 : ${msg}`);

    function innerFunction(text:string){
        console.log(`내부 함수 실행 : ${text}`);
    }

    innerFunction("중첩된 함수에서 출력!");
}

outerFunction("외부 함수 실행 시작!");



// 3. 고차 함수
// 함수를 인자로 받건, 함수를 반환하는 함수

// 숫자를 받아서 숫자를 반환하는 함수를 리턴함
function makeAdder(x:number):(y:number) => number {
    return function(y:number):number {
        return x+y;
    };
}

const add10 = makeAdder(10);
console.log(add10(5));

// 고차함수 + 화살표 함수 버전
// 더 간결하게 표현 가능
const makeMulti = (x:number) => (y:number) => x*y;

const mul2 = makeMulti(2);
console.log(mul2(10));