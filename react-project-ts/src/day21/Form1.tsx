import { useState } from "react";

interface SignupForm {
    username:string;
    password:string;
    email:string;
    phone:string;
}

function GoodSigupForm() {
    const [form, setForm] = useState<SignupForm>({
        username:"",
        password:"",
        email:"",
        phone:"",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setForm(prev => ({
            ...prev,
            [name]:value,
        }));
    };

    const handleSubmit = () => {
        alert(form);
    };

    return (
        <div style={{padding:20, border:"1px solid #ccc", width:300}}>
            <h3>회원가입</h3>

            <input
                name="username" 
                value={form.username}
                onChange={handleChange}
                placeholder="아이디"
            />

            <input
                name="password" 
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호"
            />

            <input
                name="email" 
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="이메일"
            />

            <input
                name="phone" 
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="전화번호"
            />

            <button onClick={handleSubmit} style={{marginTop:12}}>
                가입하기
            </button>
        </div>
    );
}

export default GoodSigupForm;