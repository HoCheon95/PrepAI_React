// 수학 관련 함수와 상수를 모아둔 모듈

//두 수를 더하는 함수
export function add(a:number, b:number):number {
    return a+b;
}

// 두 수를 곱하는 함수
export function multiply(a:number, b:number) { // 타입 추론 (리턴 생략)
    return a*b;
}

export const PI = 3.14159;

// 제곱을 계산하는 함수
export function square(n:number):number {
    return n*n;
}