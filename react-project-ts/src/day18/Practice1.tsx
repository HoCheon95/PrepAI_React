import { useEffect, useState } from "react"

function SearchExample() {
    // JSX 에 입력된 searchTerm 에 대한 state를 생성하고
    // searchTerm 이 setState 될 때마다 console을 출력하는 useEffect를 생성하세요.

    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(()=>{
        console.log(`state 변경! : ${searchTerm}`);
    },[searchTerm]);

    return (
        <div style={{padding:20}}>
            <h2>검색 컴포넌트</h2>

            <input 
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
                placeholder="검색어를 입력하세요" 
            />
            <p>현재 검색어 : {searchTerm}</p>
        </div>
    )
}

export default SearchExample