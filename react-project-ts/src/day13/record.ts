/*
Record<K, T> 특징 및 사용법
1. key : 객체의 키 타입을 정의
2. value : 각 키에 매핑되는 값 타입을 정의

3. 동일한 구조의 프로퍼티들을 가진 객체 타입 정의에 유용
4. 값 변경이나 속성 추가 시 타입 안전성을 보장
 */

// 1. Record 기본 사용 예시

type Scores = Record<string, number>;

const playerScores:Scores = {
    "a":100,
    "b":20,
    "c":50,
};

playerScores.a = 90;
console.log(playerScores);



// 2. 키를 유니온 타입으로 제한
type TeamScore = Record<'red'|'blue'|'yellow', number>;

const teamScores:TeamScore = {
    red:100,
    blue:20,
    yellow:50,
}

console.log(teamScores);


// 3. value 타입을 객체로 사용
type UserInfo = Record<string, {age:number; email:string}>;

const users:UserInfo = {
    사람1:{age:30, email:"email"},
    사람2:{age:20, email:"email2"},
    사람3:{age:10, email:"email3"},
}

console.log(users);









// Record 를 사용하여 key의 타입은 리터럴타입(3개) value의 타입은 객체(속성 2개)인 타입을 생성하고
// 타입을 이용하여 객체 생성 후 출력하시오
type Test = Record<'a'|'b'|'c', {name:string; age:number}>;

const test:Test = {
    a:{name:"name1", age:10},
    b:{name:"name2", age:20},
    c:{name:"name3", age:30},
}

console.log(test);