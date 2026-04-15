import { useState } from "react";

/**
 * 문제 1) 기본 useState + 타입 추론 (Inference)
 *
 * count 값을 화면에 보여주고 버튼을 누르면 1씩 증가하게 만드세요
 * 단, count는 타입 추론으로(number) 자동 결정되도록 작성하세요
 */
function Problem1() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h3>현재 카운트</h3>
        <p>{count}</p>
        <button onClick={() => setCount((prev) => prev + 1)}>증가</button>
      </div>
    </>
  );
}

export default Problem1;

// id, name, age, skill1, skill2(선택적 프로퍼티), desc(선택적 프로퍼티) 를 속성으로 가진 interface 생성
// 해당 타입의 배열을 useState 의 제네릭에 삽입
// useState 의 초기 값은 5개 이상
// jsx 구현 시 선택적프로퍼티는 && 또는 삼항연산자를 사용하여 분기
// 버튼 클릭 시 데이터가 추가 되도록 구현
interface Person {
  id: number;
  name: string;
  age: number;
  skill1: string;
  skill2?: string;
  desc?: string;
}

export function Problem2() {
  const [persons, setPersons] = useState<Person[]>([
    { id: 1, name: "이름1", age: 11, skill1: "스킬1", skill2: "스킬11", desc: "설명1" },
    { id: 2, name: "이름2", age: 12, skill1: "스킬2", skill2: "스킬22", desc: "설명2" },
    { id: 3, name: "이름3", age: 13, skill1: "스킬3", skill2: "스킬33", desc: "설명3" },
    { id: 4, name: "이름4", age: 14, skill1: "스킬4", skill2: "스킬44", desc: "설명4" },
    { id: 5, name: "이름5", age: 15, skill1: "스킬5", skill2: "스킬55", desc: "설명5" },
  ]);

  const addPerson = () => {
    const newPerson:Person = {
        id:6,
        name:"이름6",
        age:16,
        skill1:"스킬6",
        skill2:"스킬66",
        desc:"설명6"
    };
    setPersons([...persons, newPerson]);
  }

  return (
    <>
      <h2>사람 목록</h2>
      {persons.map((p) => (
        <ul key={p.id}>
          <li>이름 : {p.name}</li>
          <li>나이 : {p.age}</li>
          <li>스킬1 : {p.skill1}</li>
          <li>스킬2 : {p.skill2}</li>
          <li>desc : {p.desc}</li>
        </ul>
      ))}
      <button onClick={addPerson}>사람 추가</button>
    </>
  );
}
