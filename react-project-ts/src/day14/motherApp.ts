import { add, multiply } from "./mathModule.ts";
import { getLength, toUpperCase } from "./stringModule.ts";


const sum = add(10, 20);
console.log(sum);

const product = multiply(10, 20);
console.log(product);

// stringModule.ts 에 있는 함수를 import 해서 출력하시오.
const upper = toUpperCase("hello");
console.log(upper);

const length = getLength("hello");
console.log(length);