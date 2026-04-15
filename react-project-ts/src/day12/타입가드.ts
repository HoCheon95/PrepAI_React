/* eslint-disable @typescript-eslint/no-explicit-any */
// 1. 일반 타입 가드(typeof)
function doubleValue(x:number | string) {
    // 타입 좁히기
    if(typeof x === "number") {
        // x 는 숫자 타입 좁혀짐
        return x*2;
    } else {
        // x 는 string 으로 좁혀짐
        return x + x;
    }
}

console.log(doubleValue(10));
console.log(doubleValue("문자열"));


// 2. 배열 타입 가드(Array.isArray)
function processItems(items:number[] | string){
    // 타입 좁히기 문법
    if(Array.isArray(items)){
        return items.length;
    } else {
        return items.toUpperCase();
    }
}

console.log(processItems([1,2,3,4,5]));
console.log(processItems("aaaaaaa"));


// 3. 클래스 타입 가드(instanceof)
class Dog{
    bark(){
        console.log("멍멍!!");
    }
}

class Cat{
    meow(){
        console.log("야옹!!");
    }
}

function speak(animal: Dog|Cat){
    if(animal instanceof Dog){
        animal.bark();
    } else{
        animal.meow();
    }
}

speak(new Dog());
speak(new Cat());


// 4. 객체 속성/인터페이스 타입 가드(in)
interface Bird{
    fly():void;
}
interface Fish{
    swim():void;
}

function move(animal:Bird|Fish) {
    if("fly" in animal){
        animal.fly();
    } else {
        animal.swim();
    }
}

const sparrow : Bird = {fly: () => console.log("참새가 날아간다.")};
const fish : Fish = {swim: () => console.log("잉어가 헤어침다.")};

move(sparrow);
move(fish);


// 5. null 타입 가드
function printName(name:string|null){
    if(name !== null) {
        console.log(name.toUpperCase());
    } else {
        console.log("이름이 없습니다.");
    }
}

printName("이름!!");
printName(null);


// 6. 사용자 정의 타입 가드
type FishType = {swin:()=>void};
type BirdType = {fly:()=>void};

function isFish(animal:FishType|BirdType):animal is FishType{
    return (animal as FishType).swin !== undefined;
}

function getFood(animal:FishType|BirdType){
    if(isFish(animal)){
        return "물고기 사료";
    }else{
        return "새 먹이";
    }
}

console.log(getFood({swin: () => {}}));
console.log(getFood({fly: () => {}}));


// 7. Promise 타입 가드
function isPromise<T>(obj:any) : obj is Promise<T>{
    return obj && typeof obj.then == "function";
}

const res1 = Promise.resolve(42);
const res2 = 42;

console.log(isPromise(res1));
console.log(isPromise(res2));


// test 라는 함수를 만드세요.
// 1) 매개변수는 하나이며, number, string, undefined, null, boolean 타입 이 다 가능하도록 하세요
// 2) 제대로 return 이 될 수 있게 타입 좁히기를 통해 분기를 하세요.
function test(arg:number|string|undefined|null|boolean){
    if(typeof arg === "number"){
        console.log("숫자 타입입니다");
    } else if (typeof arg === "string"){
        console.log("문자열 타입입니다");
    } else if (typeof arg === "undefined"){
        console.log("undefined 타입입니다");
    } else if (arg === null){
        console.log("null 타입입니다");
    } else if (typeof arg === "boolean"){
        console.log("boolean 타입입니다");
    }
}

test(1);
test("문자열");
test(undefined);
test(null);
test(true);