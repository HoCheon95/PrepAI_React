export interface GreetingProps {
    name: string;
    age?:number;
    x?:number;
    y?:number;
}

export interface GreetingProps2 {
    name:string;
    age?:number;
    onClick: () => void; // 부모에서 전달 되는 콜백 함수
}