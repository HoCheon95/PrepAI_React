import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

/**
 * 1. 진입점 파일은 애플리케이션이 브라우저에서 실행되는 최초의 시작 지점
 * 2. React 자체 기능이 아니라, 리액트를 웹 페이지에 연결하는 역할을 담당한다<div className=""></div>
 * 3. createRoot(document.getElementById('root')!).render( -> 리액트 컴포넌트 트리를 브라우저에 처음으로 그리는 과정)
 * 4. 여기는 절대 코딩을 하는 공간이 아니다. (물론 전역 라이브러리 관련 설정이나 코딩은 제외!)
 */
createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
