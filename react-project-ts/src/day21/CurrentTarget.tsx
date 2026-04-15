import type React from "react"

const TargetVsCurrentTarget = () => {
    const handleClick = (e:React.MouseEvent<HTMLButtonElement>)=>{
        console.log(`e.target : ${e.target}`);
        console.log(`e.currentTarget : ${e.currentTarget}`);
    };

    return (
        <button onClick={handleClick} style={{padding:20}}>
            <span>클릭</span>
        </button>
    );
}

export default TargetVsCurrentTarget;