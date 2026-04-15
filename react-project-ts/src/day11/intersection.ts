/**
 * 1. 타입 정의
 */
type Person = {
    name:string;
    age:number;
}

type Developer = {
    skill:string;
}

/**
 * 2. intersection 타입 : Person 과 Developer 의 속성을 모두 가져야 함
 */
type DeveloperPerson = Person & Developer;

/**
 * 3. 변수 선언 및 할당
 */
const dev1:DeveloperPerson = {
    age:12,
    name:"이름",
    skill:"리액트 중급",
};

/**
 * 4. 함수에서 intersection 타입 활용
 */
function introduceDev(dev:DeveloperPerson) {
    console.log(`이름: ${dev.name}`);
    console.log(`나이: ${dev.age}`);
    console.log(`스킬: ${dev.skill}`);
}

introduceDev(dev1);