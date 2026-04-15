import { useState } from "react";

interface Product {
    id:number;
    price:number;
    stock:number;
}

export default function ProductList() {
    const[products, setProducts] = useState<Product[]>([
        {id:1, price:10000, stock:5},
        {id:2, price:20000, stock:4},
        {id:3, price:30000, stock:3},
        {id:4, price:40000, stock:2},
        {id:5, price:50000, stock:1},
    ]);

    return (
        <>
            <h2>상품 목록</h2>

            {products.map((p) => (
                <div key={p.id}>
                    <p>가격 : {p.price}원</p>
                    <p>재고 : {p.stock > 0 ? "있음" : "없음"}</p>
                </div>
            ))}
        </>
    );
}

// GoodsList 라는 컴포넌트를 만드세요.
// id(숫자), name(문자열), price(숫자), stock(문자열), description(문자열) 속성이 있는 interface를 만들고
// 해당 타입의 객체 배열을 useState의 타입으로 지정한 후
// 가상 객체를 여러 개 만들어 화면에 출력하세요.
