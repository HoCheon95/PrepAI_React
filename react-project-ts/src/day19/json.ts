/*
JSON 문자열
- 쌍따옴표만 사용
- 함수, undefined 없음
*/

const jsonResponse: string = `
{
    "id":1,
    "name":"이름",
    "email":"naver.com",
    "isActive":true
}
`;

/*
JSON -> JavaScript 객체

JSON.parse()
- JSON 문자열 -> 자바스크립트 객체
- 이 순간 부터 객체처럼 접근 가능
*/

interface User {
    name:string;
    email:string;
}

const parsedUser:User = JSON.parse(jsonResponse);

console.log(parsedUser.name);
console.log(parsedUser.email);

/*
자바스크립트 객체 -> JSON
 */

// 클라이언트에서 만든 객체
const newUser: User = {
    name:"이름",
    email:"naver.com",
};

/*
JSON.stringify()
- 객체 -> JSON 문자열
- 서버로 전송할 때 사용
*/

const jsonToSend : string = JSON.stringify(newUser);
console.log(jsonToSend);

/*
API 통신 흐름 요약

1. 서버 -> Json 문자열
2. JSON.parse()
3. typescript의 인터페이스로 검증
4. state 저장 -> 화면 렌더링

1. 클라이언트 : 객체 생성
2. JSON.stringify()
3. 서버 전송
*/