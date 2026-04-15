// 1. 기본 사용 예시
function add(x:number, y:number) {
    return x+y;
}

// 함수 반환 타입 추출
type AddReturn = ReturnType<typeof add>;

let res:AddReturn = add(10,20);
console.log(res);


// 2. API 호출 함수 예시
interface User {
    id:number;
    name:string;
}

function fetchUser():User {
    return {id:1, name:"이름"};
}

// 반환 타입 자동 추출
type FetchUserReturn = ReturnType<typeof fetchUser>;

const user : FetchUserReturn = fetchUser();
console.log(user.id, user.name);


// User2 인터페이스 생성(age, skill)
// fetchUser2 함수(리턴타입:User2)를 생성하고 age(숫자) 와 skill(문자열)을 객체로 반환하는 함수를 만드세요.
// 함수 생성 후 Return 타입을 사용해서 새로운 타입을 생성
// 생성된 타입을 사용해 객체를 생성 후 출력
interface User2 {
    age:number;
    skill:string;
}

function fetchUser2({age, skill}:User2){
    return {age:age, skill:skill};
}

type FetchUser2Return = ReturnType<typeof fetchUser2>;
const user2 : FetchUser2Return = fetchUser2({age:10, skill:"skill"});

console.log(user2);


// 3. 제네릭과 결합 예시
function wrapInArray<T>(value:T){
    return [value];
}

type WrappedString = ReturnType<typeof wrapInArray<string>>;
type WrappedNumber = ReturnType<typeof wrapInArray<number>>;

const arr1:WrappedString = wrapInArray("Hello");
const arr2:WrappedNumber = wrapInArray(123);

console.log(arr1);
console.log(arr2);

