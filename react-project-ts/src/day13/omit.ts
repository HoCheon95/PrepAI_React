// 1. 원본 타입 정의
interface User{
    id:number;
    name:string;
    email:string;
    age:number;
}

// 2. Omit 기본 사용
type UserWithoutEmail = Omit<User, "email">;

const user1:UserWithoutEmail = {
    id:1,
    name:"name",
    age:30,

};

console.log(user1);

// 3. K는 반드시 T의 키여야만 함
type UserWithoutEmail2 = Omit<User, "email2">; // 이렇게 되면 email2 라는 속성이 제거하는데 없는 속성이기 떄문에 Omit을 쓸 필요가 없다

const user2:UserWithoutEmail2 = {
    id:1,
    name:"name",
    age:30,
    email:"Email"
};

console.log(user2);


// 4. 다른 매핑 타입과 결합 가능
type ReadonlyUserWithoutEmail = Readonly<Omit<User, "email">>;

const readonlyUser : ReadonlyUserWithoutEmail = {
    id:10,
    name:"밥",
    age:12,
};

console.log(readonlyUser);




// 모든 속성이 필수 프로퍼티인 인터페이스르 만드세요.
// Omit 을 사용하여 위에서 만든 인터페이스 중 두 개의 속성을 제거한 타입을 만드세요
// 생성된 타입을 Partial을 사용하여 모두 선택적 프로퍼티로 변경한 후 출력하세요.

interface Test {
    name:string;
    email:string;
    age:number;
}

type Test2 = Omit<Test, "email" | "age">;

const test:Partial<Test2> = {
    name:"name"
}

console.log(test);