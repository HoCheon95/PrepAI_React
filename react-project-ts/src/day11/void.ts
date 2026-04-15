/**
 * 1. 반환 값이 없는 함수에서 void 사용
 */
function sayHello(name:string):void {
    console.log(`안녕하세요!${name} 님!`); // 안녕하세요!이름!! 님!
}

sayHello("이름!!!!!!");

/**
 * 2. void 타입 변수 사용
 */
let unusable:void;
unusable = undefined;
// unusable = null;

console.log(unusable); // undefined

/**
 * 3. void 함수 내에서 return 문
 */
function logMessage(msg:string):void {
    console.log(msg); // sdas
    return; // return 만 썻을 경우에는 void를 사용 가능하다. 결국 반환 값이 없다는 것임
}

console.log(logMessage("sdas")); // undefined

/**
 * 4. void 함수 호출 후 반환 값 확인
 */
let res3 = sayHello("이름헬로!!"); // 안녕하세요!이름헬로!! 님!
console.log(res3); // undefined

/**
 * undefined 가 할당된 변수를 만든다.
 * null 이 할당된 변수를 만든다.
 * 두 개의 변수를 제어하는 if 문을 만드세요.
 * 예시 : 1) 두 개다 필터링 된다/안된다.
 */

// let a:undefined;
// let b:null;
// if (a===undefined){
//     console.log(`a는 undefined 입니다.${a}`);
// } else {
//     console.log(`a는 undefined가 아닙니다.${a}`);
// }

// if (b === null) {
//     console.log(`b는 null 입니다.${b}`);
// } else {
//     console.log(`b는 null이 아닙니다. ${b}`);
// }