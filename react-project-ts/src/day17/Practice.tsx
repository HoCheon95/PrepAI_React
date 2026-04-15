import { useState } from "react";

// boolean, string, number, 중첩 객체, 2depth 중첩 객체가 들어가 interface를 생성하세요interface Test {
interface Test {
    id:number;
    name:string;
    isActive:boolean;
    nestedObj:{
        nestedName:string;
        nestedAge:number;
        nestedObj2:{
            nested2Name:string;
            nested2Age:number;
        };
    };
};
// 생성된 interface를 타입으로 선언한 useState를 만드세요(객체 배열)
export default function Practice() {
    const [tests, setTests] = useState<Test[]>([
        {
            id: 1,
            name: "Test 1",
            isActive: true,
            nestedObj: {
                nestedName: "Nested 1",
                nestedAge: 25,
                nestedObj2: {
                    nested2Name: "Nested 2",
                    nested2Age: 30
                }
            }
        }
    ]);
    // 1. 버튼1 : 클릭 시 새로운 객체 추가
    const addTest = () => {
        const newTest:Test = {
            id: tests.length + 1,
            name: `Test ${tests.length + 1}`,
            isActive: false,
            nestedObj: {
                nestedName: `Nested ${tests.length + 1}`,
                nestedAge : 20 + tests.length,
                nestedObj2: {
                    nested2Name: `Nested 2-${tests.length + 1}`,
                    nested2Age: 30 + tests.length,
                }
            }
        };
    };
    // 2. 버튼2 : 클릭 시 중첩 객체의 속성 값 수정
    // 3. 버튼3 : 클릭 시 2depth 중첩 객체의 속성 값 수정
    // 4. 버튼4 : 클릭 시 boolean 속성을 토글
    // jsx : boolean 토글에 따라 다른 text가 보이도록 하세요(삼항연산자나 &&(and) 사용도 추천)
}

