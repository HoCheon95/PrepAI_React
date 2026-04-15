import { useEffect, useState } from "react";
// DummydataList.tsx 파일을 만들고
// useEffect 는 처음 한번만 실행되도록 하세요

// 데이터를 담기위한 문자열 배열 타입의 useState 생성

// userEffect 첫 실행 시 setState 실행

// .map을 사용해서 JSX 에서 데이터 시각화

// 해당 컴포넌트 완성 후 루트 컴포넌트에 import 한 후 정상 작동 확인
function DummydataList() {
    const [dataList, setDataList] = useState<string[]>([]);

    useEffect(()=>{
        const fetchData = async () => {
            const dummyData = ['데이터1', '데이터2', '데이터3'];
            setDataList(dummyData);
        };

        fetchData();
    },[]);

    return (
        <div>
            <h3>더미 데이터 목록</h3>
            <ul>
                {/* .map을 사용해서 JSX 에서 데이터 시각화 */}
                {dataList.map((item, index) => ( 
                    <li key={index}>{item}</li> // 배열의 각 요소를 리스트 형태로 출력한다
                ))}
            </ul>
        </div>
    );
}
export default DummydataList