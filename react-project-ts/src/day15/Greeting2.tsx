import type { GreetingProps } from "./type2.ts"

function Greeting2({name,age, x, y}: GreetingProps) {
  return (
    <>
        <h1>Hello, {name}</h1>
        
        {age ? <h1>저는 {age}살 입니다...</h1> : <h1>나이 데이터는 없음</h1>}
        {x ? <h1>저는 {x}살 입니다...</h1> : <h1>나이 데이터는 없음</h1>}
        {y ? <h1>저는 {y}살 입니다...</h1> : <h1>나이 데이터는 없음</h1>}
    </>
  );
}

export default Greeting2