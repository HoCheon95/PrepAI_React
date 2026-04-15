// 함수 오버로딩 : 같은 함수 명이지만 서로 다른 매개변수/반환 타입을 가질 수 있음

/*
1. 오버로드 시그니처
1) 함수 구현 전에 선언부만 정의
2) 매개변수와 변환 타입을 다양하게 지정 가능
3) 중괄호 {} 는 없다.

2. 실제 구현
1) 모든 오버로드 시그니처를 처리할 수 있는 함수 본체 작성
2) 매개변수 타입이 여러 타입일 수 있으므로 union type 사용
3) 내부에서 타입 체크(typeof)를 통해 분기 처리

3. 주의
1) 잘못된 타입으로 호출하면 컴파일 시 오류 발생
2) 함수 구현 시 반환 타입을 오버로드 시그니처에 맞춰야 함
*/

// 1. 오버로드 시그니처 선언(중괄호 없는 선언)
function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: string, b: number): string | number;

// 2. 실제 구현 함수 (모든 오버로드를 처리하는 본체)
function combine(a: string | number, b: string | number): string | number {
  if (typeof a === "string" && typeof b === "string") {
    return a + b; // 문자열 합치기
  } else if (typeof a === "number" && typeof b === "number") {
    return a + b; // 숫자 함치기
  } else if (typeof a === "string" && typeof b === "number") {
    return a + b; // 문자열 숫자 합치기
  } else {
    throw new Error("배개변수 타입이 맞지 않습니다");
  }
}


// 3. 사용
const combineStrings =  combine("aaaa", "bbbb");
console.log(combineStrings);

const combineNumbers = combine(1111, 3333);
console.log(combineNumbers);

// 얘가 정상적으로 작동할 수 있도록 오버로드 시그니처를 선언하고 구현 함수에 로직을 추가하시오
const test = combine("Hell", 999999);
console.log(test);
