import Putton from "./Putton.tsx";
import { useCounter } from "./useCounter.ts";

export default function Home() {
    const {count, increment, decrement} = useCounter(0);

    return (
        <div style={{padding:"20px"}}>
            <h1>Count : {count}</h1>

            <Putton label="증가" onClick={increment}/>
            <Putton label="감소" onClick={decrement}></Putton>

        </div>
    );
}