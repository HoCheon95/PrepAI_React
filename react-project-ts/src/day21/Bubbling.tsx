const EventFlowExample = () => {
    return (
        <div
            onClick={()=>console.log("DIV 클릭")}
            style={{padding:20, border:"2px solid black"}}
        >
            <button
                onClick={()=>console.log("Button 클릭!")}
                style={{padding:20}}
            >
                <span onClick={()=>console.log("span 클릭!")}>
                    클릭
                </span>
            </button>
        </div>
    );
}

export default EventFlowExample;