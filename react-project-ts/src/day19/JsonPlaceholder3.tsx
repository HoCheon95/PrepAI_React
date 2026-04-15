// "https://jsonplaceholder.typicode.com/comments"
//에 POST 요청을 보내고 응답 데이터 시각화 컴포넌트를 따로 만들어 볼 것
import { useEffect, useState } from "react";

interface Comment {
    id:number;
    name:string;
    email:string;
    body:string;
}

function CreateComment () {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [body, setBody] = useState("");

    const handleSubmit = async() => {
        const commentData = {
            name:name,
            email:email,
            body:body,
            postId:1,
        };

        const jsonData = JSON.stringify(commentData);

        console.log(`서버로 보내는 JSON 데이터 : ${jsonData}`);

        try {
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/comments",
                {
                    method:"POST",
                    headers:{
                       "Content-Type" : "application/json",
                    },
                    body:jsonData,
                }
            );
            const result = await response.json();
            console.log(`서버 응답 : ${result}`);
            console.log(result);
        } catch(error) {
            console.log(`에러발생! ${error}`);
        }
    };

    return (
        <>
            <h2>댓글 작성</h2>

            <input type="text"
                placeholder="이름"
                value={name}
                onChange={(e)=>setName(e.target.value)}
            />

            <br />

            <input type="email"
                placeholder="이메일"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />

            <br />

            <textarea
                placeholder="댓글 내용"
                value={body}
                onChange={(e)=>setBody(e.target.value)}
            />

            <br />

            <button onClick={handleSubmit}>댓글 작성</button>
        </>
    );
}

export default CreateComment;