import { square } from "./mathModule.ts";
import { getLength, toUpperCase } from "./stringModule.ts";
import { getUsers } from "./userService.ts";

// 모듈화 특징 : 유지보수 + 협업 용이하다
// 기능 수정 시 해당 모듈만 수정하면 되므로 유지보수가 쉬움


console.log(square(12));
console.log(getUsers());


// 아까 만들었던 stringModule 의 함수를 import 하여 실행해보세요
console.log(toUpperCase("hello"));

const length = getLength("hello");
console.log(length);