interface User {
    id:number;
    name:string;
    age:number;
    profile: {
        hobby:string;
    };
};

// Readonly<T> 적용
type ReadonlyUser = Readonly<User>;

const user1:ReadonlyUser = {
    id:1,
    name:"name",
    age:30,
    profile:{
        hobby:"swim",
    },
};

// user1.id = 123123;

user1.profile.hobby = "run";
console.log(user1);


// 배열에 적용
const nums:ReadonlyArray<number> = [1,2,3];

// nums[0] = 10;
// 읽기 전용은 push 도 안된다.
// nums.push(4);

console.log(nums);


// 함수 매개변수에 적용
function printUser(user:Readonly<User>){
    console.log(`ID : ${user.id} NAME : ${user.name}`);

    user.profile.hobby = "This is my real hobby";
    console.log(user);
};

printUser(user1);

