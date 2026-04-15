/* eslint-disable @typescript-eslint/no-explicit-any */
let anyValue:any = 123;
anyValue = "Hello";
anyValue = {};
anyValue = null;

console.log(anyValue);

// any 타입 배열
let list: any[] = [1,true,"free"];
list[1] = 100;

// 명시적으로 any 타입을 지정한 경우
let product:any = 1234;
product = 'p1234';
console.log(product);

// 암시적으로 any 타입이 되는 경우
let product_code;
product_code = 12345;
product_code = '123123123';
console.log(product_code);