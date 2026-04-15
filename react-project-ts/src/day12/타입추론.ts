// 1. 변수 선언 시 초기 값으로 타입 추론
let count = 10;

console.log(count);

let str = "문자열";
console.log(str);

function add(a:number, b:number){ // 리턴타입은 두 개의 매개변수가 넘버 타입이기 때문에 리턴타입이 추론된다.
    return a+b;
}
console.log(add(3,6));

// 3. 함수 매개변수 기본 값으로 타입 추론
function greet(msg:string = "Hello"){
    console.log(msg);
}

greet();

// 4. 배열 초기 값으로 타입 추론
let nums = [1,2,3,4];
console.log(nums);

let names = ["봉구", "두부"];
console.log(names);

// 5. 객체 초기 값으로 타입 추론 -> 이렇게 쓰지 말고 꼭 인터페이스를 생성하여 객체를 생성하자.
interface User{
    name:string;
    age:number;
}

let user:User = {
    name:"이름",
    age:30,
};

console.log(user);