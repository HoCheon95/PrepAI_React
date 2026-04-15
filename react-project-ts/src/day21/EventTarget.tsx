import React, { useState } from "react"

const InputPropertyExample = () => {
    const [form, setForm] = useState({
        userName:'',
        age:0,
        isAgree:false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        const {name, value, checked, type, id} = e.target;

        console.log(`이벤트 발생 ID : ${id}`);

        setForm(prev => ({
            ...prev,
            [name]:
                type === "checkbox"
                ? checked
                : name === "age"
                ? Number(value)
                : value,
        }));
    };

    return (
        <div style={{padding:20, border:"1px solid #ccc"}}>
            <h3>input 속성 종합 예제</h3>

            <div>
                <label>이름 : </label>
                <input
                    id="input-name"
                    type="text"
                    name="userName"
                    value={form.userName}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>나이 : </label>
                <input
                    id="input-age"
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>
                    <input
                        id="input-agree"
                        type="checkbox"
                        name="isAgree"
                        checked={form.isAgree}
                        onChange={handleChange}
                    />
                    약관에 동의합니다
                </label>
            </div>

            <pre style={{marginTop:20}}>
                {JSON.stringify(form, null, 2)}
            </pre>
        </div>
    );
}

export default InputPropertyExample;