// 1. 일반 타입에서 사용
type MaybeString = string | null | undefined;

// NonNullable 로 null/undefined 제거
type OnlyString = NonNullable<MaybeString>;

let str1:OnlyString = "Hello";
// str1 = null; // 'null' 형식은 string 형식에 할당할 수 없다
// str1 = undefined; // 'undefined' 형식은 string 형식에 할당할 수 없다

console.log(str1);


// 2. 함수 반환 값에서 사용
function fetchName(id:number) : string | null {
    return id>0? "이름" : null;
}

type SafeName = NonNullable<ReturnType<typeof fetchName>>;

let name : SafeName = "Safe Name";
// name = null; // 'null' 형식은 string 형식에 할당할 수 없다

console.log(name);
fetchName(12);
fetchName(0);


// 3. 객체 선택적 속성에서 사용
type User = {
    id:number;
    email?: string | null;
};

type RequiredEmail = NonNullable<User['email']>;

let userEmail:RequiredEmail = "Eamil@email";
// userEmail = null;

console.log(userEmail);


// 4. 제네릭 타입과 함꼐 사용
function processValue<T>(value:T) : NonNullable<T> {
    if (value === null || value === undefined) {
        throw new Error("값은 null 또는 undefined가 불가");
    }

    return value as NonNullable<T>;
}

const res = processValue("Hello");
const res2 = processValue("H");
// const res3 = processValue(null);
// const res4 = processValue(undefined);

console.log(res);
console.log(res2);
// console.log(res3);
// console.log(res4);




// 런타임 안전성 주의
type MaybeMunber = number | null | undefined;

type OnlyNumber = NonNullable<MaybeMunber>;

let num1:OnlyNumber = 43;
// num1 = null;

console.log(num1);

function printNumber(value:OnlyNumber) {
    if(value === null || value === undefined){ // 타입 가드를 꼭 해주자
        throw new Error("null 이나 undefined 가 넘어옴");
    }
    console.log(value.toFixed(2));
}

printNumber(5);
// printNumber(null);



// 2. 유니온 타입 일부만 제거
type Mixed = string|number|null|undefined;
type NonNullMixed = NonNullable<Mixed>;

let a:NonNullMixed = "Hello";
a = 123;
console.log(a);


// 3. readonly 속성과 함께 사용 시 주의
type User2 = {
    readonly id:number|null;
    name:string|undefined;
};

type SafeUser2 = {
    readonly id:NonNullable<User2['id']>;
    name:NonNullable<User2['name']>;
};

const user22:SafeUser2 = {
    id:101,
    name:"name",
};

// user22.id = 102; // 읽기 전용 속성이므로 id에 할당할 수 없다

console.log(user22);