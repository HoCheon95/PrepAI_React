interface User{
    readonly id:number;
    name:string;
    age?:number;
}

const user1:User ={
    id:1,
    name:"이름",
    age:30
};

console.log(user1.id);
console.log(user1.name);
console.log(user1.age);

user1.name="수정된 이름";

console.log(user1.name);

// user1.id=111; // JS에서 Object.freeze 와 비슷

/**
 * read only 가 들어간 인터페이스를 만들고
 * read only 가 없는 인터페이스를 만들어서 readonly 가 들어간 인터페이스를 상속하여 객체를 만드세요.
 */

interface Test1{
    readonly id:number;
    name:string;
    age:number;
}

interface Test2 extends Test1{
    skill:string;
}

const userTest1:Test2 ={
    id:2,
    age:23,
    name:"test",
    skill:"코딩",
};

console.log(userTest1);