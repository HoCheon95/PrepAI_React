/* eslint-disable @typescript-eslint/no-explicit-any */
// 타입 호환 예제

// 1. 구조적 타입 호환 : 객체의 구조가 같으면 타입 호환 가능
type Person = {name:string; age:number};
type Emplyee = {name:string; age:number};

let p : Person = {name:"이름", age:30};
let e : Emplyee = p;
console.log(e);


// 2. Union 타입 호환
type A = string | number | boolean;
let value:A;

value = 10;
value = "Hello";
value = true;
// boolean 타입을 union 하고 value 에 boolean 값 할당을 해보세요.

console.log(value);


// 3. interface 타입 호환
interface Point {x:number, y:number};
interface Position {x:number, y:number};

let point:Point = {x:10, y:20};
let post:Position = point;

console.log(post);

// a:불린, b:문자열 인 인터페이스 2개를 생성하여 타입 호환을 구현해보시오
interface Test1 {a:boolean, b:string};
interface Test2 {a:boolean, b:string};

let test1:Test1 = {a:true, b:"문자열"};
let test2:Test2 = test1;

console.log(test2);


// 4. function 타입 호환
// let func1:(a:number)=>void;
// let func2:(a:number)=>void;

// func1 = func2;


// 5. Class 타입 호환
class Animal {name:string="";}
class Dog {name:string=""; breed:string="";}

let animal:Animal;
let dog:Dog = new Dog();

animal = dog; // Dog는 Animal 구조를 포함하는 호환 가능
// dog = animal; Animal에는 breed 속성이 없으므로 호환 불가
console.log(animal);


// 6. 제네릭 타입 호환
interface Box<T> {content:T};

let boxNumber: Box<number> = {content:123};
let boxAny: Box<any> = {content:"문자열"};

boxAny = boxNumber; // Box<number> 는 Box<nay>에 할당 가능하다.
console.log(boxAny);