import { useState } from "react";

function StateType() {
  const [count, setCount] = useState<number>(0);

  type User = {
    name: string;
    age: number;
  };

  const [user, setUser] = useState<User>({
    name: "이름",
    age: 12,
  });

  const updateUser = () => {
    setUser({ name: "찰스", age: user.age + 1 });
  };
  return (
    <>
      <div style={{ padding: 20 }}>
        <h2>타입 안전성 예시</h2>

        <div>
          <h3>숫자 카운터</h3>
          <p>현재 카운트 : {count}</p>
          <button onClick={() => setCount((prev) => prev + 1)}>카운트 증가</button>
        </div>

        <hr />

        <div>
          <h3>user 정보</h3>
          <p>이름:{user.name}</p>
          <p>나이:{user.age}</p>
          <button onClick={updateUser}>나이 증가 + 이름 변경</button>
        </div>
      </div>
    </>
  );
}

export default StateType;
