import { useState } from "react";

function CreatePost () {
    // 1. 입력 값을 관리하는 state
    const [title,setTitle] = useState("");
    const [body, setBody] = useState("");

    // 2. POST 요청 함수
    const handleSubmit = async() => {
        // 현재 객체는 자바스크립트 객체 상태
        // 이대로는 네트워크로 전송 불가

        const postData = {
            title:title,
            body:body,
            userId:1,
        };

        // JSON.stringify
        // 자바스크립트 객체 -> JSON 문자열
        // 서버와 통신하기 위한 필수 과정

        const jsonData = JSON.stringify(postData);

        console.log(`서버로 보내는 JSON 데이터 : ${jsonData}`);

        try {
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/posts",
                {
                    method:"POST",
                    headers:{
                        /*
                        Content-Type 을 application/json 으로 지정
                        서버에게 이 데이터는 JSON 형식의 데이터 임을 알려줌
                        */
                       "Content-Type" : "application/json",
                    },
                    body:jsonData,
                }
            );
            const result = await response.json(); // 파채 JSON.parse(response)
            console.log(`서버 응답 : ${result}`);
            console.log(result);
        } catch(error) {
            console.log(`에러발생! ${error}`);
        }
    };

    return (
        <>
            <h2>게시글 작성</h2>

            <input type="text"
                placeholder="제목"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
            />

            <br />

            <textarea
                placeholder="내용"
                value={body}
                onChange={(e)=>setBody(e.target.value)}
            />

            <br />

            <button onClick={handleSubmit}>등록</button>

        </>
    );
}

export default CreatePost;