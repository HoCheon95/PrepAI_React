// 전역 공간 보호 + 유지보수
// counter 값은 이 hook 내부에서만 관리되면 전역 변수에 영향을 미치지 않는다.

import { useState } from "react";

export function useCounter(init : number = 0){
    const [count, setCount] = useState(init);

    return {
        count,
        increment: () => setCount((prev) => prev+1),
        decrement: () => setCount((prev) => prev-1),
    };
}