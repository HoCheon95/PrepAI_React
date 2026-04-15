// 1. 기본 튜플
// 튜플은 배열이지만 길이와 각 요소 타입이 고정된 구조.

let rgb : [number, number, number] = [255, 255, 0];

let x : [string, number];

x = ["hello", 0];

console.log(`x 튜플 : ${x}`);
console.log(`rgb : ${rgb}`);


// 2. 튜플 사용 예시
let user : [number, string, boolean] = [123, "이름", true];

console.log(`user[0] : ${user[0]}, `);
console.log(`user[1] : ${user[1]}, `);
console.log(`user[2] : ${user[2]}`);


// 3. 2차원 튜플
let users : [number, string, boolean][];

users = [
    [1, "이름1", true],
    [2, "이름2", false],
    [3, "이름3", true],
]

console.log(`users : ${users}`);


// 4. 튜플의 특정 값 자체를 리터럴 타입으로 고정
// 첫 번째 요소는 숫자 1만 가능
let tuple : [1, number];

tuple = [1,3];
tuple = [1,4];

console.log(tuple);


// 첫 번째 값이 문자열로 고정된 2차원 튜플을 생성하고 출력하세요.
// 튜플의 길이는 3이고 나머지 값은 마음대로 해도 됨
let test : ["문자열", number, boolean][];

test = [
    ["문자열", 1, true],
    ["문자열", 2, false],
    ["문자열", 3, true]
]

console.log(test);