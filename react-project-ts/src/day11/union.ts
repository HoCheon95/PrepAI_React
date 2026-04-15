/**
 * 1. 타입 정의
 */
type Person = {
  name: string;
  age: number;
};

type Developer = {
  name: string;
  skill: string;
};

const tester: Person = {
  age: 12,
  name: "나여",
};

/**
 * tester2 객체를 Developer 타입으로 만든 다음에
 * console.log(`Developer 속성 skill : ${someone.skill}`)를 출력해보시오
 */
const tester2: Developer = {
    name : "저요",
    skill : "바람",
};

/**
 * 2. 유니온 타입 함수 예시
 */
function introduce(someone: Person | Developer) {
  console.log(`공통 속성 name : ${someone.name}`);
  // console.log(`공통 속성 아님 age : ${someone.age}`); // 한쪽에만 있는 속성은 사용할 수 없다!

  /**
   * 3. 타입 좁히기(Type Narrowing) 사용
   */
  if("age" in someone) {
    console.log(`Person 속성 age : ${someone.age}`);
  }

  if ("skill" in someone) {
    console.log(`Developer 속성 age : ${someone.skill}`);
  }
}

introduce(tester);
introduce(tester2);

/**
 * 3. 유니온 타입 배열 예시
 */
const people:(Person|Developer)[] = [
    {name:"A1", age:25},
    {name:"A2", skill:"리액트 오지게 잘함"},
    {name:"A3", age:29},
    {name:"A4", skill:"JS 오지게 잘함"},
];

// 배열 순회하며 타입 좁히기 적용
people.forEach((someone) => {
    console.log("이름:", someone.name);
    if("age" in someone) {
        console.log("나이:", someone.age);
    }
    if("skill" in someone) {
        console.log("스킬:", someone.skill);
    }
});

