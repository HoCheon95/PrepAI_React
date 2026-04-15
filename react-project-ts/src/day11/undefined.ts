/**
 * 1. 값이 할당되지 않은 변수의 기본 값
 */
let a: number; // a는 number 타입 변수로 선언됨
a = 1;
console.log(a); // 값이 할당되지 않았기 때문에 undefined

/**
 * 2. 함수에서 return이 없으면 자동으로 반환되는 값
 */
function sayHello(name: string): void {
  console.log("Hello" + name); // Hello이름
}

let res = sayHello("이름");
console.log(res); // undefined

/**
 * 3. 명시적으로 undefined 할당 가능
 */
let b: undefined = undefined;
console.log(b); // undefined

/**
 * 4. undefined 와 null 비교
 */
let c: null = null;
console.log(typeof a); // undefined
console.log(typeof c); // object

/**
 * 5. undefined를 체크할 때
 */
if (a === undefined) {
    console.log("a는 아직 값 할당이 되지 않음...");
}