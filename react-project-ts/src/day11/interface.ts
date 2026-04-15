/**
 * 1. 인터페이스 정의
 */
interface Person {
    name: string;
    age: number;
}

interface Developer {
    name: string;
    skill:string;
}

/**
 * 2. 인터페이스 사용
 */
const user1:Person ={
    name:"유저1",
    age:25,
};

const dev1:Developer = {
    name:"개발자1",
    skill:"자바를 잘합",
};

/**
 * 3. 인터페이스를 함수에 활용
 */
function introduce(person:Person){
    console.log(`이름:${person.name}, 나이:${person.age}`);
}

function introduceDev(dev:Developer){
    console.log((`이름:${dev.name}, 스킬:${dev.skill}`));
}

introduce(user1);
introduceDev(dev1);

/**
 * 5. 인터페이스의 장점
 * 
 * - 다른 인터페이스를 상속 가능
 */
interface PersonWithAddress extends Person {
    address:string;
}

const user2:PersonWithAddress ={
    name:"상속이름",
    age:12,
    address:"주소",
};

console.log(user2);


/**
 * 6. 함수 타입 정의도 가능
 */
interface Add {
    (a:number, b:number):number;
}
const sum:Add = (x,y)=>x+y;
console.log(sum(1,2));

/**
 * 인터페이스를 생성하고 생성된 인터페이스를 상속받아 새로운 인터페이스를 생성하세요.
 * 새로운 인터페이스 타입을 매개변수로 받는 함수를 작성하세요.
 * 그리고 새로운 인터페이스로 만든 객체를 함수의 인자로 넣고 출력하세요.
 */
interface Test1 {
    name:string;
    age:number;
}


interface Test2 extends Test1 {
    id:string;
}

function printTest(test:Test2){
    console.log(test.name);
    console.log(test.age);
    console.log(test.id);    
}

const test3:Test2 ={
    name:"test이름",
    age:22,
    id:"test아이디",
};


printTest(test3);
