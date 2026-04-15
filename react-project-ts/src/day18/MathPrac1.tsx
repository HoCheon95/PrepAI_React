// MathPrac1.tsx 파일(컴포넌트)을 생성하고
// 해당 컴포넌트에 간단한 숫자 연산 및 결과 값을 보여주도록 구현하세요
// 숫자는 부모 컴포넌트의 props 로 전달받도록 하고
// 부모 컴포넌트에서 props 를 변경하는 버튼도 만들어보세요

type Child2Props = { 
  num1: number;
  num2: number;
}

function Child2({ num1, num2 }: Child2Props) {
  return (
    <>
        <p>연산 값 : {num1 + num2}</p>
    </>
  );
}

export default Child2;
