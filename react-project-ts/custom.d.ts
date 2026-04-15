/* eslint-disable @typescript-eslint/no-explicit-any */
// 1. 일반 CSS 파일 import 처리
// import './App.css'; 처럼 사용하고 싶을 떄
declare module '*.css' {
    const classes: Record<string, string>;
    export default classes;
}

// 2. CSS Modules 처리
declare module '*.module.css' {
    const classes : {readonly[key:string]:string};
    export default classes;
}

// 3. JS Modules 처리
declare module '*.js' {
    const classes : any;
    export default classes;
}

