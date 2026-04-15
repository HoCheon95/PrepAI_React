/* eslint-disable @typescript-eslint/no-explicit-any */
const fruits: string[] = ["Apple", "Banana", "Orange"];
console.log(fruits);

const fruits2: Array<string> = ["Apple", "Banana", "Orange"];
console.log(fruits2);

const nums: number[] = [1, 2, 3];
console.log(nums);

const boolean: boolean[] = [true, false, true];
console.log(boolean);

const anys:any[] = [1, "Apple", true];
console.log(anys);

function getArr(...args:number[]):number[]{
    return args;
}

getArr(1,2,3,4,5,6);

// 숫자 배열을 타입 지정하여 생성 후 스프레드 연산자를 통해 배열을 합치시오
const numArr:number[] = [1,2,3,4,5];
const numArr2:number[] = [6,7,8,9,10];
const mergeArr = [...numArr, ...numArr2];
console.log(mergeArr);

// 바구니를 만들고 만들어진 배열을 스프레드 연산자로 복사하여 출력하시오
const basket: number[] = [1, 2, 3];
const newBasket = [...basket];
console.log(newBasket);

// 인터페이스 생성하고 객체의 타입을 만들어진 인터페이스로 타입을 지정 후 객체를 스프레드 연산자를 사용하여 복사
interface Basket {
    items: string[];
    total: number;
}
const myBasket: Basket = {
    items: ["Apple", "Banana", "Orange"],
    total: 3,
};

const newBasket2 = {...myBasket};
console.log(newBasket2);