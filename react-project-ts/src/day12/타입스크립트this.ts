// 1. 인터페이스 정의 : this 로 사용할 객체 타입
interface ICat {
    name:string;
}

// 2. ICat 타입 객체 생성
const cat : ICat = {
    name:"야옹이",
};

// interface Dog{
//     name2:string;
// }

// const dog:Dog = {
//     name2:"멍멍이",
// };


// 3. this 타입을 명시한 함수 선언
// *실제 자바스크립트 런타임에서는 this 파라미터가 전달되지 않으며, 컴파일 때 타입체크 용도로 사용된다.
function someFn(this:ICat, greeting:string){
    // this가 ICat 이므로 this.name 에 접근이 가능하다.
    console.log(`${greeting} ${this.name}`);
}

// 4. call 메서드로 this 를 cat 객체로 지정하여 호출
someFn.call(cat, "Hello"); // call, apply, bind, 화살표 함수 등 this 바인딩 함수 중에 화살표, bind가 가장 많이 사용됨

// bind 예시
const bindFn = someFn.bind(cat);
bindFn("반가워");


/*
타입 스크립트는함수 내부의 this 타입을 자동으로 추론하지 못한다.
그래서 함수 선언 시 this:타입 을 첫 번째 인자 형태로 선언한다.
단, 실제 함수 호출 시 첫 번째 인자로 this를 넘기지 않는다.
오로지 타입 시스템을 위한 용도
 */