
interface ButtonProps3 {
    color:string;
    label:string;
    onClick:()=>void;
}

function Button3({color,label,onClick}:ButtonProps3) {
    return(
        <>
            <button
                style={{backgroundColor:color,
                    color:"wheat",
                    padding:"10px 16px",
                    border:"none",
                    borderRadius:"9px",
                }}
                onClick={onClick}
            >
                {label}
            </button>
        </>
    );
}

export default Button3;