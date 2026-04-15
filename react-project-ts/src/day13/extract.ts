// 1. Extract<t,U> T와 U 두 타입에서 겹치는 타입만 추출

type T1 = "a" | "b" | "c";
type U1 = "a" | "c" | "d";

type Result = Extract<T1, U1>;

let p : Result = "a";
p="c"; // a랑 c만 올 수가 있다

console.log(p);



// 2. Extract 는 리터럴 타입의 유니온 타입 기반 필터링에 적합
// 단일 타입이나 객체 타입에는 직관적이지 않을 수 있다
type NumberOrString = number | string;
type ExtractString = Extract<NumberOrString, string>;

type ExtractNumber = Extract<NumberOrString, number>;

type ExtractBoolean = Extract<NumberOrString, boolean>;

const p2:ExtractString = "문자열";

console.log(p2);

console.log({} as ExtractNumber);
console.log({} as ExtractBoolean);


// 3. 객체 타입과 함께 사용 시 주의
type Obj1 = {a:number; b:string};
type Obj2 = {b:string};

type ExtractObj = Extract<Obj1, Obj2>; // never 가 된다. 이렇게 사용하지 말 것!

console.log({} as ExtractObj);


// 또 다른 사용 예시
type Letters = "x"|"y"|"z";

type Selected = Extract<Letters, "x"|"z">;

let p3:Selected = "x";

console.log(p3);



// 숫자와 문자열 리터럴 타입이 들어간 numAndStr 타입을 선언하고
// Extract 를 사용하여 여러개의 공통 리터럴 타입을 추출한 NewNumAndStr 타입을 생성하세요.
// NewNumAndStr 타입으로 만든 변수를 생성하세요
// 변수에 공통 리터럴 타입 말고 다른 타입이 할당될 수 있는지 확안하세요.
type numAndStr = 1|2|3|"a"|"b"|"c";

type NewNumAndStr = Extract<numAndStr, 1|2|"a"|"b">;

let p4:NewNumAndStr = "a"; // 공통 리터럴 1|2|"a"|"b" 만 입력 가능

console.log(p4);