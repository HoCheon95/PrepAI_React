/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * unknown 타입은 '알 수 없는 타입' 이라는 의미이다.
 * 어떤 값이든 저장할 수 있지만, 사용할 때는 타입 체크가 필요하다.
 */
let value:unknown;

value = 123;
value = "Hello";
value = {a:1};
value = [1,2,3];
value = null;

console.log(value);

/**
 * unknown은 any와 다르게, 바로 사용하면 에러 발생
 */
let value2:unknown = "Hello";
console.log(value2);
// console.log(value2.toUpperCase()); // 바로 메서드 사용

// 타입 체크 이후에는 안전하게 사용 가능
if(typeof value2 === "string") {
    console.log(value2.toUpperCase());
}

// unknown은 any가 들어갈 수 있는 변수에도 할당 가능
let anyValue:any;
let unknownValue:unknown = 10;
anyValue = unknownValue;
console.log(anyValue);

// 하지만 그 반대는 불가능
let u:unknown;
// let n : number = u; // unknown -> number 불가
console.log(u);