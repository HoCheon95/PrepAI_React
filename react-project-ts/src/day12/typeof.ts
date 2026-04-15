// 객체 선언
const user = {
    name:"이름",
    age:30,
    isAdmin:true,
}

type UserType = typeof user;

const newUser:UserType = {
    name:"이름",
    age:22,
    isAdmin:false,
}

console.log(user);
console.log(newUser);



// 함수 선언
function sum(a:number, b:number){
    return a+b;
}

// typeof 를 사용하여 함수 타입 추출
type SumFunctionType = typeof sum;
// SumFunctionType은 (a:number, b:number) => number 타입을 갖게 된다.


const mySum : SumFunctionType = (x,y) => x+y;
console.log(mySum(10,20));