/* eslint-disable @typescript-eslint/no-explicit-any */
// 1. 일반 함수 예시
function getNumber():number {
    return 42;
}

// 반환 타입 추출
type GetNumberReturn = ReturnType<typeof getNumber>;
const num:GetNumberReturn = getNumber();
console.log(num);

// 2. 비동기 함수 예시
async function fetchUser():Promise<{id:number, name:string}>{
    return {id:1, name:"이름"};
}

// 실제 값 타입을 추출하고 싶으면 Awaited 사용
type FetchUserValue = Awaited<ReturnType<typeof fetchUser>>;

async function showUser() {
    const user : FetchUserValue = await fetchUser(); // Awaited로 인해 Promise 가 풀렸다.
    console.log(user.id, user.name);
}

showUser();


// 3. 함수 오버로드 주의
// function overloaded(x:number):number;
// function overloaded(x:string):string;
// function overloaded(x:any):any{
//     return x;
// }

// type OverloadedReturn = ReturnType<typeof overloaded>;
// let val : OverloadedReturn = overloaded(100);
// console.log(val);