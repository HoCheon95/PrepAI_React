// 1. Partial 기본 예시
interface User {
    id:string;
    name:string;
    age:number;
}

// PartialUser: 모든 속성이 선택적 프로퍼티로 변경됨
type PartialUser = Partial<User>;

const user1:PartialUser = {name:"이름"};
console.log(user1);


// 2. Partial<T>를 update 기능에서 사용하는 경우
function updateUser(id:string, data:Partial<User>){
    console.log(`업데이트 요청 (ID : ${id}`, data);
}

updateUser("A1", {name:"수정이름1"});
updateUser("A1", {age:30});
updateUser("A1", {id:"수정된 ID"});


// 3. 폼 입력 진행 중 일부 값만 존재하는 경우
interface SignUpForm {
    email:string;
    password:string;
    nickname:string;
};

let tempForm:Partial<SignUpForm> = {};

tempForm.email = "email@email";
tempForm.nickname = "nickname";

console.log(`현재까지 입력된 폼 : ${JSON.stringify(tempForm)}`);


// 4. API 응답을 여러 단계로 나누어 받을 때 사용
interface Profile{
    id:string;
    level:number;
    exp:number;
};

function getProfileStep1(): Partial<Profile> {
    return {id:"USER01"};
}

function getProfileStep2(): Partial<Profile> {
    return {level:15, exp:1200};
}

let profile:Partial<Profile> = {};

profile = {...profile, ...getProfileStep1()};
profile = {...profile, ...getProfileStep2()};

console.log(`최종적으로 합쳐진 프로필 : ${JSON.stringify(profile)}`);


// 5. Partial<T> 특징 : 원본 타입은 그대로 유지
interface Product{
    id:string;
    price:number;
}

const p:Partial<Product> = {id:"A1", price:30000};
const p2:Product = {id:"A1", price:30000};

console.log(p2);
console.log(p);


// 6. Partial<T> 주의점 : undefined 가능성 존재
interface Account{
    id:string;
    balance:number;
}

function processAccount(data:Partial<Account>) {
    if (data.balance !== undefined){
        console.log(`새 잔고 : ${data.balance = 1000}`);
    } else {
        console.log("잔액 없음.(undefined) 일 때 처리 필요");
    }
}

processAccount({});
processAccount({balance:5000});


// 7. 과도한 Partial<T> 사용 : 타입 안전성 저하
// 모든 값이 부분 업데이트가 가능하다라는 구조가 남발되면
// 원래 반드시 필요한 값이 누락되어도 컴파일 에러를 발생시키지 않는다.
function saveUser(user:Partial<User>) {
}

// 컴파일에서는 오류가 발생하지 않지만 위험하다.
saveUser({name:"No ID 유저"});


// interface 를 만들고 (인터페이스 이름 자유, boolean, string, number 속성 생성)
// Partial<T> 를 매개변수의 타입으로 넣어 console.log를 실행하는 함수를 만들고 호출하세요.
interface Test {
    state:boolean;
    name:string;
    age:number;
}

const test2:Partial<Test> ={
    name:"이름",
}

function test22 (obj:Partial<Test>){
    console.log(obj);
}

test22(test2);


