import { useEffect, useState } from "react";

interface Post{
    id:number;
    name:string;
    email:string;
    body:string;
}

function CommentsList() {
    const [comt, setComt] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        (async() =>{
            setIsLoading(true);
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/comments"
            );
            // JSON -> JavaScript 객체 [파채]
            const data:Post[] = await response.json();
            setComt(data);
            setIsLoading(false);
        })();
    },[]);

    return(
        <div>
            <h2>댓글 목록</h2>
            {isLoading&&<p>로딩중......</p>}

            <ul>
                {comt.slice(0,5).map((comt)=>(
                    <li key={comt.id}>
                        <strong>{comt.name}</strong>
                        <br />
                        <strong>{comt.email}</strong>
                        <p>{comt.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CommentsList;