import { useState } from "react";

function DeleteExample () {
    const [items, setItems] = useState<number[]>([1,2,3]);

    const handleDelete = (id:number) => {
        console.log(`삭제요청 ID : ${id}`);

        setItems(prev => 
            prev.filter(item => item !== id)
        );
    };

    return (
        <div>
            <h2>화살표 함수 사용 이유</h2>

            <ul>
                {items.map(item=>(
                    <li key={item}>
                        아이템{item}
                        <button onClick={() => handleDelete(item)}>
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default DeleteExample;