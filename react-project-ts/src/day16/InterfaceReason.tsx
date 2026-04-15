import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function ProductInfo() {
  /////////////// state 영역 시작 ///////////////
  const [product, setProduct] = useState<Product | null>(null);

  /////////////// state 영역 종료 ///////////////

  /////////////// 함수 영역 시작 ///////////////
  // Product 구조와 정확히 일치하는 객체만 setProduct로 설정 가능하다
  // 만약 속성의 타입이 다르거나 누락되면 컴파일 에러가 발생
  const loadProduct = () => {
    setProduct({
      id: 1,
      name: "게이밍 마우스",
      price: 23000,
    });
  };
/////////////// 함수 영역 끝 ///////////////
  return (
    <>
      <button onClick={loadProduct}>상품 불러오기</button>
      {product && (
        <div>
          <h2>상품 정보</h2>
          <p>아이디 : {product.id}</p>
          <p>이름 : {product.name}</p>
          <p>가격 : {product.price}</p>
        </div>
      )}
    </>
  );
}
