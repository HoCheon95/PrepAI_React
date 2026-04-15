import React, { useState } from "react";

function ControlledInputExample () {
    const [phone, setPhone] = useState<string>("");

    const [error, setError] = useState<string|null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // 입력 제한 : 숫자가 아닌 문자는 모두 제거
        value = value.replace(/[^0-9]/g, "");

        // 입력 값 가공 : 전화번호 형식으로 자동 하이픈 추가
        if(value.length <= 3) { 
            /* empty */ 
        } else if (value.length <= 7) {
            value = `${value.slice(0,3)}-${value.slice(3)}`;
        } else {
            value = `${value.slice(0,3)}-${value.slice(3,7)}-${value.slice(7,11)}`
        }

        setPhone(value);

        // 실시간 유효성 검사
        // 전화번호는 13자리(하이픈 포함) 이여야 한다.
        if(value.length >0 && value.length < 13) {
            setError("전화번호를 끝까지 입력해주세요(11자리)")
        } else {
            setError(null);
        }
    };

    const handleSubmit = () => {
        alert(`제출된 전화번호 : ${phone}`);
    }

    return (
        <div style={{padding:20, border:"1px solid #ccc", width:"320px"}}>
            <h3>제어 컴포넌트 예제</h3>

            <input 
                type="text"
                value={phone}
                onChange={handleChange}
                placeholder="전화번호 입력"
            />

            {error && (
                <p style={{color:"red", marginTop:"8px"}}>
                    {error}
                </p>
            )}

            <button
                onClick={handleSubmit}
                disabled={!!error || !phone}
                style={{marginTop:12}}
            >
                제출
            </button>
        </div>
    );
}

export default ControlledInputExample;