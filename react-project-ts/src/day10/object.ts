// 1. object 타입
// - 원시타입(number, string, boolean 등)을 제외한 모든 타입
let obj: object = {};
let arr: object = [];
let func: object = function () {};

let date: object = new Date();

console.log(obj, arr, func, date);

// 2. object 타입의 문제점
// 프로퍼티 접근 불가
let userX: object = { name: "이름", age: 30 };
// console.log(userX.name);

// 3. 객체 타입 리터럴
// 특정 속성과 타입을 명시적으로 정의
let userA : {name: string; age:number};

userA = {
    name:"이름",
    age:13
};
console.log(userA);

// 4. 타입 리터럴은 지정된 속성과 타입만 허용된다.
let userB : {name: string; age:number};

userB = {
    name:"이름",
    age:13
};
console.log(userB.name);

// 5. 정리
// Object : 매우 넓은 타입 -> 구조 정보 없음 : object 타입으로 선언되면 객체의 속성처럼 접근하지 못한다.