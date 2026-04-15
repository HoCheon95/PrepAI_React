// 1. 함수 선언식(호이스팅 가능)
function add(a:number, b:number):number {
    return a+b;
}
console.log(add(2,3));

// 2. 함수 표현식
// 변수에 직접 함수 타입을 선언하는 방식
const multiply:(x:number, y:number) => number = function(x,y){
    return x*y;
}
console.log(multiply(2,3));

// 익명 함수에 타입을 바로 명시하는 방식
const divide = function(x:number, y:number):number {
    return x/y;
}
console.log(divide(6,2));

// 3. 화살표 함수
// 화살표 함수는 es6에서 추가된 함수 표현 방식으로 콜백 함수로 자주 사용됨
const subtract = (a:number, b:number):number => {
    return a-b;
}
console.log(subtract(5,1));

// 매개변수가 하나라도 소괄호를 생략하지 말자
const greet = (name:string):string => `Hello, ${name}`;
console.log(greet("이름"));

let function22: (arg1:number, arg2:number) => number = (x,y) => {return x+y};
console.log(function22(1,2));