// 1. 기본 타입 정의
type Person={
    name:string;
    age:number;
}

// 2. 올바른 객체 할당
let person1:Person = {
    name:"이름",
    age:30,
};

// 3. 초과 프로퍼티가 있는 객체 리터럴
let person2:Person = {
    name:"이름2",
    age:22,
    // gender:"f" // 초과 프로퍼티 검사
}

console.log(person1);
console.log(person2);


// 4. 함수 인자로 전달 시 초과 프로퍼티 검사
function printPerson(p:Person) {
    console.log(`${p.age}, ${p.name}`);
}

printPerson({
    age:20,
    name:"이름11",
    // skill:"자바" // 초과 프로퍼티 검사
});


// 5. 변수에 먼저 할당하면 초과 프로퍼티 검사를 우회 가능
const temp = {name:"템프", age:30, gender:"male"};
let person3:Person = temp;
console.log(person3);

