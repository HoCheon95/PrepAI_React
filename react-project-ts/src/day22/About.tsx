export default function About() {
    return (
        <html>
            <head>
                <title>About</title>
            </head>
            <body>
                <h1>About Page</h1>

                <p>
                    이 페이지는 Home 과 다른 tsx 파일이며,
                    서버가 새 html 문서를 내려준다.
                </p>
                <a href="/">Home으로 이동</a>
            </body>
        </html>
    )
}