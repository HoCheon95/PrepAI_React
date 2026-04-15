/**
 * 1.  숫자 리터럴 타입
 */
let num1:3;
num1 = 3;

console.log(num1); // 3

// 타입 생략 가능
const num2 = 5;
// num2 = 6;
console.log(num2); // 5

/**
 * 2. 문자열 리터럴 타입
 */
let str1: "hello";
str1 = "hello";
// str1 = "hello2";

console.log(str1); // hello

let direction: "up" | "down" | "left";
direction = "up";
direction = "down";

console.log(direction); // down

/**
 * 3. 함수 매개변수에도 사용 가능하다.
 */
function move(dir:"up"|"down"){
    console.log(`이동 방향 : ${dir}`); // 이동 방향 : down
}
move("down");