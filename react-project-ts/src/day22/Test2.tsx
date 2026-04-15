import axios from "axios"
import { useState } from "react"

export default function Test2() {
    const [data, setData] = useState<string>("")
    const handleClick = async () => {
        try {
            const response = await axios.get("http://localhost:8080/test123")

            setData(response.data)
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <>
            <h1>Test2</h1>
            <pre>
            {data}
                
            </pre>
            <button onClick={handleClick}>버튼</button>
        </>
    )
}