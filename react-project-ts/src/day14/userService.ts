// 모듈화 특징 : 전역 공간 보호

// userList 변수는 이 파일에만 존재하며, 전역 오염이 발생하지 않는다
const userList = ["이씨", "김씨", "박씨"];

export function getUsers():string[] {
    return [...userList];
}