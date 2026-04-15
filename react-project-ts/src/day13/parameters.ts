/* eslint-disable @typescript-eslint/no-explicit-any */
// 1. 일반 함수 파라미터 추출
function greet(name:string, age:number){
    console.log(`Hello ${name}, ${age}`);
}

// greet 함수의 매개변수 타입을 추출 : [string, number]
type GreetParams = Parameters<typeof greet>;

const args:GreetParams = ["String", 23123];
greet(...args);


// 2. 파라미터 타입 재사용(중복 선언 방지)
function sum(a:number, b?:number):number{
    if(b===undefined || b === null){
        return a;
    }
    return a+b;
}

type Sumparams = Parameters<typeof sum>;

const s:Sumparams = [3,4];
console.log(sum(...s));


// 3. 비동기 함수에도 사용 가능
async function fetchUser(id:number, active?:boolean){
    return {id, active};
}

type FetchParams = Parameters<typeof fetchUser>;

const res2:FetchParams = [1,true];
console.log(fetchUser(...res2));


// 4. 제네릭 함수에서 활용
function identity<T>(value:T, msg:string):T{
    console.log(msg);
    return value;
}

type IdentityParams = Parameters<typeof identity>;

const p:IdentityParams = [123, "Hello"];
console.log(identity(...p));


// 5. 함수 타입에도 적용 가능
type FnType = (id:number, name:string) => boolean;

type FnParams = Parameters<FnType>;

const params:FnParams = [1, "이름"];
console.log(params);


// 오버로드 시 주의점
function format(x:string):string;
function format(x:number, y:number):string; // 얘만 타입 추론에 사용됨
function format(x:any, y?:any){
    return String(x)+(y??"");
}

// 타입스크립트는 오버로드된 함수 중 마지막 시그니처만 타입 추론에 사용한다

type FormatParams = Parameters<typeof format>;
const p4:FormatParams = [1,2];
console.log(format(...p4));


// 실제 사용 예시(인자 타입 재사용)
function createUser(name:string, age:number|null|undefined, isAdmin:boolean|null|undefined){
    const isAgeValid = age !== null && age !== undefined;
    const isAdminValid = isAdmin !== null && isAdmin !== undefined;

    if (isAgeValid && isAdminValid) {
        return { name, age, isAdmin };
    } 
    
    if (isAgeValid) {
        return { name, age };
    } 
    
    if (isAdminValid) {
        return { name, isAdmin };
    }

    return { name };
}

type CreateUserParams = Parameters<typeof createUser>;

function makeUser(...args:CreateUserParams){
    return createUser(...args);
}

const user = makeUser("문자열", null, undefined);
console.log(user);


// createUser 의 매개변수 age, isAdmin에 null, undefined 를 유니온 타입으로 결합시키고
// 타입 가드를 활용하여 정상적으로 리턴이 되도록 함수를 수정하시오
