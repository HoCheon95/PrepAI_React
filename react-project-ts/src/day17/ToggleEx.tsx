import { useState } from "react";

export function ToggleExample() {
    const [isOn, setIsOn] = useState<boolean>(false);

    // 위험한 토글
    function toggleBad(){
        setIsOn(!isOn);
    }

    // 안전한 토글
    function toggleGood(){
        setIsOn(prev=>!prev);
    }

    return (
        <div style={{marginBottom:20}}>
            <h3>토글</h3>
            <div>isOn : {String(isOn)}</div>
            <button onClick={toggleBad}>위험한 토글</button>
            <button onClick={toggleGood}>안전한 토글</button>
        </div>            
    )
}