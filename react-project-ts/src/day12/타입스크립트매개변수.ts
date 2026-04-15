// 1. 타입스크립트에서는 모든 함수 인자가 기본적으로 필수이다
function greet(name:string){
    return `Hello ${name}`;
}
console.log(greet("이름"));


// 2. 선택적 매개변수
// 매개변수 뒤에 ?를 붙이면 없어도 되는 매개변수가 된다.
// 선택적 매개변수는 반드시 마지막에 배치해야 한다.(rest parameter 랑 동일)
function sayHello(name:string, age?:number){
    if(age!==undefined){
        return `Hello ${name}, age:${age}`;
    }
    return `Hello ${name}`;
}

console.log(sayHello("이름"));
console.log(sayHello("이름", 20));


// 3. 매개변수 기본 값(default parameter)
// 매개변수에 기본 값을 지정하면 undefined를 넣어도 기본 값을 사용한다.
function greetDefault(name:string = "디뽈트"){
    return `Hello ${name}`;
}
console.log(greetDefault());
console.log(greetDefault("디폴트가 아닌 이름"));
console.log(greetDefault(undefined));


// 4. 나머지 매개변수(rest parameter)
// 여러 인자를 배열로 받음(...items)
// 일반 변수가 나오면 맨 뒤로 가야됨
function sum(name:string,...nums:number[]){
    console.log(name);
    return nums.reduce((acc,cur) => acc+cur, 0);
}
console.log(sum("스트링 타입", 1,2,3,4,5));


// 5. 네임드 파라미터(객체 구조 분해)
// 파라미터 개수가 많을 때 주로 사용
// 타입/인터페이스로 구조를 정의해두면 더 깔끔
interface UserInfo{
    name:string;
    age:number;
    email?:string;
}

function printUser({name:name2, age, email}:UserInfo){
    console.log(`Name : ${name2}`);
    console.log(`Age : ${age}`);
    console.log(`Email : ${email}`);
}

printUser({name:"이름", age:30});
printUser({name:"이름", age:30, email:"이메일"});


// 선택적 프로퍼티 + 네임드파라미터 + 디폴트 파라미터를 조합하여 인터페이스와
// 함수를 만들고 함수를 호출하시오.
interface Test{
    name:string;
    skill:string;
    address?:string;
    alias:"별명"; // 리터럴 타입
}

function testF({name, skill, address="주소", alias}:Test){
    console.log(name, skill, address, alias);
}

testF({name:"이름", skill:"스킬", alias:"별명"});

// 화살표 함수를 만들고 네임드 파라미터를 만들어 나머지를 출력하도록 하세요.
const test2 = ({name, skill, address="주소2", alias}:Test) =>{
    console.log(name,skill,address, alias);
};
test2({name:"이름2", skill:"스킬2", alias:"별명"});