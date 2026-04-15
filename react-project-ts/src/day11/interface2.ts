/**
 * 1. 선택적 프로퍼티 정의
 */
interface User {
    name:"이름"|"이름2"; // literal 타입 | union 타입
    age?:number;
    email?:string;
};

/**
 * 2. 선택적 프로퍼티 사용 예시
 */
const user1:User ={
    name: "이름2",
};

const user2:User ={
    name:"이름",
    age:12,
    email:"이메일"
};

console.log(user1);
console.log(user2);

/**
 * 3. 함수 파라미터에서도 선택적 프로퍼티 사용 가능
 */
function printUserInfo(user:User){
    console.log(`이름:${user.name}`);
    
    if(user.age !== undefined) console.log(`나이:${user.age}`);
    if(user.email !== undefined) console.log(`이메일:${user.email}`);
}

printUserInfo(user1);
printUserInfo(user2);