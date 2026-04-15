/* eslint-disable @typescript-eslint/no-explicit-any */
// 1. Exclude<T,U> 기본 개념
// 타입 T에서 U에 해당하는 부분을 제거한 새로운 타입 생성

type Role = "admin" | "user" | "guest";

type WithoutAdmin = Exclude<Role, "admin">; // 제거할 타입이 리터럴 타입이라면 정확히 입력해줘야 한다.


const p : WithoutAdmin = "guest";
const p2 : WithoutAdmin = "user";
// const p3:WithoutAdmin = "admin"; // admin 형식은 WithoutAdmin 형식에 할당할 수 없다

console.log(p,p2);



// 2. 불필요한 유니온 타입 제거할 떄 매우 유용
type Status = "loading" | "success" | "error" | "debug";

type CleanStatus = Exclude<Status, "debug">;

const t1:CleanStatus = "success";
console.log(t1);


console.log("CleanStatus : ", {} as CleanStatus);


// 3. 특정 타입 필터링하여 제거
type ApiResult = string | null | undefined | number;

type NonNullResult = Exclude<ApiResult, null | undefined>;

let p4:NonNullResult = "String";
const p5:NonNullResult = 123;
// p4 = null;

console.log(p4, p5);


// 4. 특정 Props 제한하기
type ButtonProps = {
    label:string;
    size:"sm"|"md"|"lg";
    theme?:"light"|"dark"|"blue";
};

type RestrictedTheme = Exclude<ButtonProps["theme"], "blue">;

// 컴포넌트에 실제 적용 예시
interface CleanButtonProps {
    label:string;
    theme?:RestrictedTheme;
}

function CleanButton(props:CleanButtonProps) {
    console.log(`theme : ${props.theme}`);
    return null as any;
}

CleanButton({label : "OK", theme:"light"});
CleanButton({label : "OK", theme:"dark"});



// 5.  이벤트 타입 필터링
type EventType = "click"|"hover"|"scroll"|"debug";

type UIEventType = Exclude<EventType, "debug">;

function handleEvent(event:UIEventType){
    console.log(`Handling : ${event}`);
}

handleEvent("click");
handleEvent("hover");
handleEvent("scroll");
console.log("=======================");

// KeyboardEventType 을 다섯개의 문자 리터럴타입을 유니온해서 생성하고
// 두 개의 이벤트를 제거한 NewKeyboardEventType 을 생성하여
// handleKEvent 함수를 만들어서 제거한 리터럴 타입이 인자로 안들어가는지 확인하세요

type KeyboardEventType = "ctrl"|"space"|"enter"|"del"|"ins";

type NewKeyboardEventType = Exclude<KeyboardEventType, "del"|"ins">;

function handleKEvent(event:NewKeyboardEventType){
    console.log(`Handling : ${event}`);
}

handleKEvent("ctrl");
handleKEvent("enter");
handleKEvent("space");


// T와 U가 유니온이 아닌 경우 결과가 직관적이지 않을 수 있다
type A = Exclude<string, number>;

console.log("A : ", {} as A);

type B = Exclude<123, number>;

console.log("B : ", {} as B);


// 2. 객체 타입에서는 부분 제거가 아닌 완전 제거가 된다
type Obj1 = {a:number; b:string};
type Obj2 = {a:number;};

type TestObj = Exclude<Obj1, Obj2>;

type TestObj2 = Exclude<Obj2, Obj2>;

console.log({} as TestObj);
console.log({} as TestObj2);

// 객체에서 부분적으로 속성을 제거하지 않는다. Omit<T, K>를 사용하자
type Wrong = Exclude<{a:number; b:string;}, "a">;
console.log({} as Wrong);


// 4. 리터럴 타입이 아닌 경우 잘 쓰이지 않는다
type X = Exclude<string, "hello">;

let pp:X = "hello";

console.log(pp);


type APIKinds = string | "admin" | "super";

type Sw = Exclude<APIKinds, "admin">;

let ppp:Sw = 'super';

console.log(ppp);