// ====================
// 문제 1: 기본 함수
// ====================
/*
Q1. 아래 함수의 타입 오류를 수정하고, sum(10, 20)의 결과를 출력하세요.
힌트: a, b 타입 지정, 반환 타입 명시 가능
*/
function sum(a:number, b:number):number {
    return a + b;
}

console.log(sum(10, 20));


// ====================
// 문제 2: type alias
// ====================
/*
Q2. User 타입을 만들어서 아래 객체에 적용하세요.
힌트: name, age 필수, email 선택적
*/
type User = {
    name:string;
    age:number;
    email?:string;
}

const user1: User = {
    name: "HanSung",
    age: 30,
    email: "hansung@example.com"
};

console.log(user1);


// ====================
// 문제 3: interface
// ====================
/*
Q3. 인터페이스를 활용하여 함수의 파라미터 타입을 정의하세요.
힌트: Product는 name, price 속성
*/
interface Product {
    name:string;
    price:number;
}

function showProduct(product: Product) {
    console.log(`${product.name} - ${product.price}원`);
}

showProduct({ name: "노트북", price: 1500000 });


// ====================
// 문제 5: 조합 문제
// ====================
/*
Q5. type과 interface, 선택적 속성, 함수 파라미터를 모두 활용하여 아래 조건을 만족하는 코드를 작성하세요.

조건:
1. interface Book { title: string, author: string }
2. type ExtendedBook는 Book을 상속 + price: number 선택적
3. 함수 printBook(book: ExtendedBook) 작성
4. price가 있으면 출력, 없으면 생략
*/
interface Book {
    title:string,
    author:string,
}

type ExtendedBook = Book & {
    price?:number,
}

function printBook(book:ExtendedBook) {
    if(book.price !== undefined) console.log(book);
    else;
}

const book:ExtendedBook = {
    author:"저자",
    title:"제목",
    price:10000,
}

printBook(book);



