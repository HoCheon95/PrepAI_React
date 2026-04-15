/**
 * age, name, id ,isAdmin(boolean) 타입을 생성하자
 * 만든 타입을 이용하여 객체를 만들자
 * 
 * id, skill, hasSkill(boolean) 타입을 생성하자
 * 만든 타입을 이용하여 객체2를 만들자.
 * 
 * 만들어진 두 개의 타입을 union 타입으로 묶어서 함수의 매개변수로 넣은 다음
 * type Narrowing 을 사용하고 출력해보자
 * if ("age" in someone)
 */

type test = {
    age:number,
    name:string,
    id:string,
    isAdmin:boolean
};

type test2 = {
    id:string,
    skill:string,
    hasSkill:boolean
}

type test3 = test & test2;

