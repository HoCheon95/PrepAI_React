/**
 * 제네릭 함수 타입 선언
 * T 라는 타입 변수를 사용하여 어떤 타입이 들어와도 그 타입을 그대로 반환하는 함수 타입을 정의한다.
 */
type GenericFunction = <T>(value:T) => T;

// 제네릭 함수 타입을 사용하여 함수 구현
const identity:GenericFunction = <T>(value:T):T => {
    return value; // 입력한 타입 T가 그대로 반환됨
};

const num = identity(100);
console.log(num);

const str = identity("hello");
console.log(str);

const obj = identity({name:"이름", age:20});
console.log(obj);


// 제네릭을 함수 자체에 직접 선언하는 방식
function wrap<T>(data:T):T{
    return data;
}
const a = wrap(true);
console.log(a);
const b = wrap([1,2,3]);
console.log(b);

// 두 개 이상의 제네릭 타입 변수를 사용하는 함수 타입
type PairFunction = <A,B>(a:A, b:B) => [A,B];

const makePair:PairFunction = (a,b) => {
    return [a,b];
}

const pair1 = makePair("Age", 30);
console.log(pair1);

const pair2 = makePair(false, {x:10, y:20});
console.log(pair2);

// 객체의 key와 value를 제네릭으로 받아 처리하는 예시
type keyValueFn = <K,V>(key:K, value:V) => {key:K, value:V};

const toObject:keyValueFn = (key, value) => {
    return {key, value};
}

const res = toObject("id", 123);
console.log(res);