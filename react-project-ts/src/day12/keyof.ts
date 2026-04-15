// 1. 간단한 객체 선언
const person = {
    name:"이름",
    age:30,
    isAdmin:true,
}

// 2. keyof + typeof 사용
type Personkeys = keyof typeof person;
// typeof person -> {name:string; age:number; isAdmin:boolean}
// keyof person -> "name"|"age"|"isAdmin"

// 3. 변수에 키만 허용
let key:Personkeys;

key = "age";
key = "name";
key = "isAdmin";

console.log(key);


// 4. 함수에서 안전하게 접근
function getValue(obj:typeof person, key:Personkeys){
    return obj[key];
}

console.log(getValue(person, "name"));
console.log(getValue(person, "age"));
console.log(getValue(person, "isAdmin"));


// 5. 타입 단언으로 특정 키 타입을 고정
function getName(obj:typeof person){
    return obj["name"] as string;
}

const nameValue:string = getName(person);
console.log(nameValue);


console.log("---------------------------");
// student 라를 객체를 만드세요.
// 속성 : name, grade(학년), skill(주요 스킬), isStudent(boolean)
// 타입을 생성 할 때 student 의 타입을 이용해 생성하세요 타입 명 StudentType
// testValue 라는 함수를 만들고 매개변수는 (StudentType의 객체, key(StudentType 의 키 값))
// 모든 속성을 출력해보세요.

const student = {
    name:"이름",
    grade:3,
    skill:"스킬",
    isStudent:true,
}

type StudentType = typeof student;

function testValue(obj:StudentType, key:keyof StudentType){
    console.log(obj[key]);
}

testValue(student, "name");
testValue(student, "grade");
testValue(student, "skill");
testValue(student, "isStudent");