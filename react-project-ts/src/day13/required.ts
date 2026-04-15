/* eslint-disable @typescript-eslint/no-explicit-any */
interface User {
    id?:string;
    name?:string;
    age?:number;
}

// 1. Required<T> 사용 : 모든 선택적 프로퍼티를 필수 프로퍼티로 변경
type RequiredUser = Required<User>;

// 모든 속성이 필수프로퍼티로 변경됨
const user1:RequiredUser = {
    id:"A1",
    name:"이름",
    age:30,
};

console.log(user1);


// 2. 함수에서 Required<T>활용 사례

// 업데이트 객체는 Partial을 사용하여 만듦
function updateUser(update:Partial<User>){
    console.log(`업데이트 데이터 : ${update}`);
}

// 그러나 저장 시에는 모든 데이터가 필수여야 할 때 Required 사용
function saveUser(user:Required<User>){
    console.log(`저장 완료 : ${user.id}, ${user.name}, ${user.age}`);
}

updateUser({name:"선택적 이름"});

saveUser({
    id:"A1",
    name:"필수 이름",
    age:30,
});



// Required 주의점
interface Profile {
    hobby?:string;
}

interface User2 {
    id?:number;
    name?:string;
    age?:number;
    profile?:Profile;
}

// Require 적용
type RequiredUser2 = Required<User2>;

const a:RequiredUser2 = {
    age:30,
    id:232,
    name:"이름",
    profile:{},
}

// 이 때 Profile 내부 hobby 속성은 여전히 선택적 프로퍼티가 유지된다.
// 왜 냐 1depth 까지만 Required 의 손이 닿기 때문이다.
console.log(a);


type DeepRequired<T> = {
    [P in keyof T]-? : T[P] extends object
    ?DeepRequired<T[P]>
    : T[P];
};

// 커스텀 훅
type DeepRequiredUser = DeepRequired<User2>;

const deep2: DeepRequiredUser = {
    age:1,
    id:2,
    name:"이름",
    profile:{
        hobby:"swim",
    },
};

console.log(deep2);





// 모든 속성이 선택적 프로퍼티인 인터페이스를 생성하고(number, string, boolean, 중립 객체)
// Required 로 인터페이스를 하나 더 만들어 함수에 넣고 출력하세요.
interface Test {
    age?:number;
    name?:string;
    state?:boolean;
    profile?:{
        hobby?:string;
    }
}

type RequiredTest = Required<Test>;

const test:RequiredTest = {
    age:1,
    name:"name",
    state:true,
    profile:{
    }
}

function test222 (obj:RequiredTest) {
    console.log(obj);
}

test222(test);