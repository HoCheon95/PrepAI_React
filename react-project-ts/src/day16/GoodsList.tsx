// GoodsList 라는 컴포넌트를 만드세요.
// id(숫자), name(문자열), price(숫자), stock(문자열), description(문자열) 속성이 있는 interface를 만들고
// 해당 타입의 객체 배열을 useState의 타입으로 지정한 후
// 가상 객체를 여러 개 만들어 화면에 출력하세요.

import { useState } from "react";

interface Goods {
    id:number;
    name:string;
    price:number;
    stock:string;
    description:string;
}

export default function GoodsList() {
    const [goods, setGoods] = useState<Goods[]>([
        {id:1, name:"이름1", price:10000, stock:"있음", description:"이름1입니다."},
        {id:2, name:"이름2", price:20000, stock:"없음", description:"이름2입니다."},
        {id:3, name:"이름3", price:30000, stock:"있음", description:"이름3입니다."},
        
    ]);

    const handleGoodsList = () => {
        const newItem:Goods = {
            id:55,
            name:"새 상품",
            price:23232,
            stock:"100",
            description:"신상임"
        };

        setGoods([...goods, newItem]);
    }

    return (
        <>
            <h2>상품 목록</h2>
            {goods.map((g)=> (
                <div key={g.id}>
                    <p>이름 : {g.name}</p>
                    <p>가격 : {g.price}</p>
                    <p>재고 : {g.stock}</p>
                    <p>설명 : {g.description}</p>
                </div>
            ))}
            <button onClick={handleGoodsList}>상품 추가</button>
        </>
    );
}

