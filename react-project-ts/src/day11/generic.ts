// 1. 제네릭 함수
function identity<T>(arg:T):T {
    return arg;
}

const num = identity<number>(42);
const str = identity<string>("hello");
// boolean 을 제네릭 타입에 넣어서 출력해보시오
const bool = identity<boolean>(true);

console.log(num);
console.log(str);
console.log(bool);

// 2. 제네릭 배열
function getFirstElement<T>(arr:T[]):T | undefined{
    return arr[0];
}

const firstNum = getFirstElement<number>([1,2,3]);
console.log(firstNum);

// getFirstElement 에 문자열 배열을 넣어 출력하시오
const firstStr = getFirstElement<string>(["a", "b", "c"]);
console.log(firstStr);

// getFirstElement 에 boolean 배열을 넣어 출력하시오
const firstBool = getFirstElement<boolean>([true, false, true]);
console.log(firstBool);

// 3. 제네릭 인터페이스
interface Box<T>{
    content:T;
}

const numberBox:Box<number> ={
    content:100,
};
console.log(numberBox);

// 문자열
const stringBox:Box<string> ={
    content:"문자열",
};
console.log(stringBox);

// Boolean
const booleanBox:Box<boolean>={
    content:true,
};
console.log(booleanBox);

// 4. 제네릭 클래스
class DataHolder<T>{
    private data:T;

    constructor(value:T){
        this.data = value;
    }

    getData():T{
        return this.data;
    }
}

const numHolder = new DataHolder<number>(123);
console.log(numHolder.getData());

// 문자열
const stringHolder = new DataHolder<string>("문자열");
console.log(stringHolder.getData());

// Boolean
const booleanHolder = new DataHolder<boolean>(true);
console.log(booleanHolder.getData());

/**
 * 제네릭의 장점
 * 1. 재사용성이 좋다.
 * 2. 타입 안정성을 확보할 수 있다.
 * 3. any 보다 안전하게 다양한 타입을 처리 가능하다.
 */