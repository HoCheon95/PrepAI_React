/**
 * 1. 기본 구조
 */
function add(a:number, b:number):number {
    return a+b;
}

const res1 = add(5,10);
console.log(res1);

/**
 * 곱하기 함수를 만들어보세요. 파라미터와 리턴값 모두 타입 지정 필요!
 */
function multiply(a:number, b:number):number {
    return a*b;
}

const res2 = multiply(5,10); // 타입외 다른 타입이 못들어가는 것을 '타입 안정성' 이라 한다.
console.log(res2);

/**
 * 2. 기본 값 지정 가능
 */
function greet(name:string="GUEST"):string {
    return `안녕하세요, ${name}님!`;
}

console.log(greet());
console.log(greet("405"));

/**
 * 나머지 함수를 만들어 보세요. 파라미터와 리턴 값 모두 타입 지정하고 default Parameter도 설정해 보세요.
 */
function test(a:number, b:number=2):number { // 리턴 값을 쓰지 않아도 되는 이유 : 타입 추론
    return a % b;
}
console.log(test(5));

function fullName(firstName:string, lastName?:string):string {
    if(lastName){
        return `${firstName} ${lastName}`;
    }
    return firstName;
}

console.log(fullName("Hocheun"));