// 타입스크립트 기초 문법

//1) 타입 지정 변수
let age : number = 20; // String a = "문자열";
const username : string = "이름";
const isAdmin:boolean = true;
age = 30;
age = 50;
// age = "문자열";
// age = false;

console.log(age);
console.log(username);
console.log(isAdmin);

// 2) 함수 타입 지정
function add(a:number,b:number):number{ // 매개변수의 타입이 확실하며 return 값의 타입을 안써줘도 된다. 이것을 타입스크립트
    return a+b;
}

console.log(add(2,3));

// 3) 객체 타입 예제
type User = { // type 이나 interface 는 파스칼 케이스를 사용한다.
    name : string;
    age : number;
    email? : string;
};

interface User2 {
    name : string;
    age : number;
    email? : string;
};

const user:User2 = {
    name : "이름",
    age : 11,
}

console.log(user);

// 4. 배열의 타입
const nums:number[] = [1,2,3,4];
console.log(nums);

// string 타입의 배열을 만들고 출력하시오
const str:string[] = ["a", "b", "c"];
console.log(str);

// 인터페이스 TestType을 생성하고
// 객체 test 를 만들어서 TestType 인터페이스로 타입을 지정하여 출력하세요.
// 객체 test 속성의 타입은 string, boolean, number 가 다 들어가도록 하세요
interface TestType {
    name : string;
    email : boolean;
    age : number;
}

const test:TestType = {
    name : "이름",
    email : true,
    age : 11,
}

console.log(test);

// 새로운 타입과 새로운 객체를 하나 더 만들고 스프레드연산자를 이용하여 test 객체와 병합하시오
interface NewType  {
    new : string;
    new2 : number;
    new3 : boolean;
}

const newObj:NewType = {
    new : "이름1",
    new2 : 11,
    new3 : true,
}

const merge = {...test, ...newObj};
console.log(merge);
// @types/lodash 에 대한 정보를 조회하고 설치하세요
// 설치가 확인되면 지우시오.