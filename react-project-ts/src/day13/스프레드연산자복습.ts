// 나머지 매개변수(Rest Parameter)

// 첫 번째 인자와 두 번째 인자를 제외한 나머지 모든 인자들을 하나의 배열로 묶어주는 함수
function greetPerson(firstName:string, lastName:string, ...titles:string[]):string{

    // Rest Parameter는 전달 된 모든 나머지 인자들을 titles 라는 배열로 묶는다.
    console.log(`Rest Parameter : ${titles}`);

    const titleString = titles.length > 0 ? ` (${titles.join(', ')})` : '';

    return `안녕하세요. ${lastName}${firstName} 님! ${titleString}`;
}

const greeting1 = greetPerson("만수", '김', '학생', '관리자', '대표');
const greeting2 = greetPerson("만수", '김');

console.log(`결과 : ${greeting1}`);
console.log(`결과 2 : ${greeting2}`);



// addMulti 라는 함수를 만들고 a(숫자 파라미터), b(숫자 파라미터), ...num(숫자배열 : rest Parameter)
// 를 매개변수로 받는 함수를 생성하세요. (리턴 타입 string)
// a와 b는 더하기 연산을 해주고 rest Parameter 는 곱하기 연산을 하도록 하세요.(곱하기는 reduce를 활용)
// 리턴 : 더하기 연산 : 값, 곱하기 연산 : 값
// addMulti 를 호출한 값을 변수에 담아 출력하세요.
function addMulti(a:number, b:number, ...num:number[]):string{
    let add = a + b;

    const addMulti = num.length > 0 ? num.reduce((arr, cur) => arr*cur, 1) : `나머지 매개변수가 없어 더하기 연산만 된 결과 ${add}`;

    return `더하기 연산 : ${add}, 곱하기 연산 : ${addMulti}`;
}

const greeting3 = addMulti(1,2);
console.log(greeting3);


// 2. 전개 연산자

// 1) 함수 호출 시 - 배열을 개별 인자로 펼치기
function calculate(x:number, y:number, z:number):number{
    return x+ y+ z;
}

const numsToSpread:[number, number, number] = [10,20,30];

// 전개 연산자는 배열의 요소들을 10,20,30 세 개의 개별 인자로 펼쳐서 함수에 전달
const result1 = calculate(...numsToSpread);
console.log(result1);


// 문자열 5개를 매개변수로 받는 함수를 작성하고 각각의 매개변수를 return 하는 함수를 만드세요
// 문자열 다섯 개가 있는 문자열 배열을 만들고 전개 연산자를 통해 함수에 인자로 전달 후 출력하세요
function Test(x:string, y:string, z:string, a:string, b:string):string {
    return `${x}, ${y}, ${z}, ${a}, ${b}`;
}

// const str:string[] = ["a", "b", "c", "d", "e"];
const str:[string, string, string, string, string] = ["a", "b", "c", "d", "e"];

const result2 = Test(...str);
console.log(result2);

console.log("-----------------");
// 방금 구현 된 코드를 restParameter 로 받도록 변경하고 map을 통해 콘솔출력
function addStr(...args:string[]):string{
    args.map((str, i) => {
        console.log(`${str}`);
    });
    return args.join(", ");
}

const result3 = addStr("a", "b", "c", "d", "e");




// 2) 배열 리터럴 예시(배열 요소들을 펼쳐서 병합 또는 복사)
const arrA = [1,2];
const arrB = [4,5];

const mergedArray = [0, ...arrA, 3, ...arrB, 6];
console.log(mergedArray);

// 3) 객체의 속성들을 펼쳐서 병합 또는 복사
const baseUser = {id:1, name:"이름"};
const location = {city:"대전", country:"한국"};

const fullUser = {
    ...baseUser,
    ...location,
    age:2553,
};

console.log(fullUser);


// 중복 된 객체의 속성이 있을 시 마지막 객체의 속성 값이 할당된다.