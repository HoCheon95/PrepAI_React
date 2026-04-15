/**
 * 1. null 타입 변수 선언
 */
let a:null = null;
console.log(a); // null

/**
 * 2. 함수에서 null 변환
 */
function getUserName():string | null {
    let userExists = false;
    if(userExists) {
        return "나는 존재한다.";
    } else {
        return null;
    }
}

let name = getUserName();
console.log(name); // null

/**
 * 3. null과 undefined 비교
 */
let b:undefined;
console.log(a==b);  // true  a, b 둘의 값이 없으므로 true
console.log(a===b); // false 엄격한 비교를 통해 타입도 같은지 비교

/**
 * 4. null 체크
 */
if(name === null) {
    console.log(`사용자가 없다...`);
}