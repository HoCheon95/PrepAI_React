// 1. 함수 표현식
export const add = function (a:number, b:number):number {
    return a+b;
}

console.log(add(2,3));

// 2. 화살표 함수
export const multi = (a:number, b:number):number => {
    return a * b;
}

console.log(multi(3,4));

// 지금 만든 함수를 사용하는 컴포넌트를 생성 후 루트컴포넌트에 import 하여 브라우저로 결과 보기

