// 타입 기본예시
type UserType = {
    name:string;
    age:number;
}

const user1:UserType ={
    name:"타입의 이름",
    age:20,
};

// 인터페이스 기본 예시
interface UserInterface {
    name:string;
    age:number;
}

const user2:UserInterface={
    name:"인터페이스의 이름",
    age:999
};

/**
 * 확장 예시
 * Type : &
 * 인터페이스 : extends
 */
type PersonType = {name:string};
type DevType = PersonType & {skill:string};

const dev1:DevType ={
    name:"타입 합병",
    skill:"타입 합병 스킬"
}

console.log(dev1);

interface PersonInterface {
    name:string;
}

interface DevInterface extends PersonInterface {
    skill:string;
}

const dev2:DevInterface = {
    name:"인터페이스 합병",
    skill:"인터페이스 합병 스킬"
}

console.log(dev2);

/**
 * 4. 중복 선언
 * 인터페이스는 자동 병합 가능, 타입은 불가
 */
interface Animal {
    name:string;
}

interface Animal{
    age:number;
}

const dog:Animal = {
    name:"봉구",
    age:7
}

console.log(dog);

// 함수 타입 선언
type SumFn = (a:number, b:number) => number;
const sum:SumFn = (a,b) => a+b;
console.log(sum(1,2));

interface MultiplyFn {
    (a:number, b:number):number;
}
const multiply:MultiplyFn = (a,b) => a*b;
console.log(multiply(3,5));

// 클래스 implements 예시
type Movable = {
    move():void;
}

interface Runnable {
    run():void;
}

class Robot implements Movable, Runnable {
    move() {
        console.log("이동");
    }
    run(): void {
        console.log("달린다");
    }
}

const r = new Robot();
r.move();
r.run();