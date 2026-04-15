/*
1. 동작 메커니즘
1) 링크 클릭 -> 서버에 새로운 HTTP 요청 -> 완전히 새로운 HTML 응답

2. 왜 서버 사이드 라우팅 인가?
1) URL에 따라 어떤 페이지를 보여줄지 서버가 결정
2) 브라우저는 단순히 요청 + 렌더링만 수행
3) 리액트 같은 JS는 거의 관여하지 않음
*/

export default function Home() {
    return (
        <html>
            <head>
                <title>Home</title>
            </head>
            <body>
                <h1>홈 페이지</h1>
                <p>이 페이지는 서버에서 새로 렌더링된 HTML 입니다.</p>

                { /* 링크 클릭시
                1. 브라우저가 서버로 HTTP GET 요청 전송
                2. 서버는 /about 요청을 받음
                3. About.tsx를 HTML로 렌더링
                4. 기존 화면 전체 교체 */}
                <nav>
                    <a href="/about">About</a>
                    <br />
                    <a href="/profile">Profile</a>
                </nav>
            </body>
        </html>
    )
}