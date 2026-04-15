import React from 'react'

// 재사용성 : Button 컴포넌트는 여러 페이지 또는 다른 컴포넌트에서 재사용 가능

type ButtonProps = {
    label:string;
    onClick:()=>void;
};

export default function Putton({label, onClick}: ButtonProps) {
  return (
    <button
        style={{padding: "10px 16px", fontSize:"16px"}}
        onClick={onClick}
    >
        {label}
    </button>
  );
}
