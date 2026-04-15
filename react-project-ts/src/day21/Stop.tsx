import React from "react";

const EventControlExample = () => {
  // 1. form 기본 동작 막기
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // 폼 제출 시 페이지가 새로고침되는 기본 동작을 막는다.
    alert("새로 고침 없이 폼을 제출함.");
  };

  // 2. 부모 클릭 이벤트
  const handleParentClick = () => {
    alert("부모 div 클릭");
  };

  // 3. 자식 버튼 클릭
  const handleChildClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();  // 클릭 이벤트가 부모 div로 퍼지는 것을 방지해야 한다.
    alert("자식 버튼 클릭 됨(부모 실행 안됨)");
  };

  // 4. a태그 기본 이동 막기
  // 🔴 <a> 태그에서 발생하는 이벤트이므로 HTMLAnchorElement 타입을 사용해야 한다.
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => { 
    e.preventDefault();  // 링크 클릭 시 페이지가 이동하는 기본 동작을 막는다.
    alert("페이지 이동 막힘");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>이벤트 기본 액션 / 이벤트 전파 방지</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="이름 입력" />
        <button type="submit">제출</button>
      </form>

      <hr />

      <div
        onClick={handleParentClick}
        style={{
          padding: 20,
          background: "#eee",
          cursor: "pointer"// 클릭 가능한 영역임을 시각적으로 보여주는 것이 좋다.
        }}
      >
        부모 영역 (클릭해 보세요)
        <br />
        <button onClick={handleChildClick} style={{ marginTop: "10px" }}>
          자식 버튼 (e.stopPropagation)
        </button>
      </div>

      {/* 링크 이동 막기 예시 */}
      <div style={{ marginTop: "20px" }}>
        {/* 🔴 handleLinkClick이 적용되는 태그는 a 태그이다. */}
        <a href="https://google.com" onClick={handleLinkClick}> 
          구글로 이동하기 (막힘)
        </a>
      </div>
    </div>
  );
};

export default EventControlExample;