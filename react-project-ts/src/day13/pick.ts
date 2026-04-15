interface User {
    id:number;
    name:string;
    email:string;
    age:number;
};

// Pick 타입 사용
// User 타입에서 id, name만 선택
type UserPreview = Pick<User, "id"|"name">;


// pick 타입 적용
const priview1:UserPreview = {
    id:1,
    name:"name",
};

console.log(priview1.id);
console.log(priview1.name);


// 예시
// API 에서 일부 속성만 전달받을 떄 유형
function getUserPreview(user:User): UserPreview{
    const{id, name} = user;
    return {id, name};
}

const userFull:User = {
    id:101,
    name:"Pick me up",
    email:"이멜",
    age:30,
};

const preview2 = getUserPreview(userFull);
console.log(preview2);


// 다른 매핑 타입과 결합 가능
type ReadonlyPreview = Readonly<Pick<User, "id" | "name">>;

const readonlyUser : ReadonlyPreview = {
    id:10,
    name:"밥",
};

// readonlyUser.id = 100;

console.log(readonlyUser);


type OptionalPreview = Partial<Pick<User, "id" | "name">>;
const optionalUser:OptionalPreview = {};

console.log(optionalUser);







// 객체의 모든 속성이 선택적 프로퍼티인 인터페이스를 생성하고 
// Pick 유틸리티 타입을 사용하여 2개의 속성만 뽑아낸 새로운 타입을 생성하세요.
// Pick 으로 생성한 타입과 Readonly를 결합하여 객체를 console.log 해보세요.
interface Test {
    name?:string;
    age?:number;
    email?:string;
}

type PickTest = Readonly<Pick<Test, "name" | "age">>;

const test:PickTest = {
    name:"name",
    age:30,
};

console.log(test);

