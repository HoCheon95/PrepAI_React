import React, { useState } from 'react';
import {
  generatePromptText,
  generateTranslationPrompt,
  IMAGE_REQUIRED_NOS,
  getExternalPassageText,
  type QuestionSetting,
} from './geminiForm';
import { EXAM_REGISTRY } from './examRegistry';
import EXTERNAL_REGISTRY from './littlePrince';


// 🔴 문제 유형 데이터를 배열로 관리하여 코드를 간결하게 만듭니다.
const QUESTION_TYPES = [
  { id: '빈칸추론', label: '빈칸 추론 (Blank)' },
  { id: '주제파악', label: '글의 주제 파악 (Topic)' },
  { id: '요지파악', label: '글의 요지 파악 (Main Idea)' },
  { id: '제목추론', label: '제목 추론 (Title)' },
  { id: '요약문', label: '요약문 완성 (Summary)' },
  { id: '순서배열', label: '내용 순서 배열 (Ordering)' },
  { id: '어법문제', label: '어법상 틀린 것 찾기 (Grammar)' },
  { id: '어휘문제', label: '문맥상 낱말의 쓰임이 틀린 것 찾기 (Vocabulary)' },
  { id: '문장삽입', label: '주어진 문장 들어가기 (Insertion)' },
  { id: '무관한문장', label: '흐름과 관계 없는 문장 찾기 (Irrelevant)' },
  { id: '대명사찾기', label: '가리키는 대상이 다른 것 찾기 (Pronoun)' },
  { id: '내용일치', label: '내용 일치/불일치 파악하기 (True/False)' },
];

const SUBJECTIVE_TYPES = [
  { id: '서답형', label: '서답형 (Short Answer)' },
  { id: '서술형', label: '서술형 (Descriptive)' },
];

export default function GeminiPromptGenerator() {
  // 사용자의 입력값을 저장할 상태들
  const [examType, setExamType] = useState('모의고사');
  const [passageSource, setPassageSource] = useState('regular');
  const [difficultyLevel, setDifficultyLevel] = useState('중');
  const [modification, setModification] = useState('원본그대로');
  const [passageText, setPassageText] = useState('');
  const [examKey, setExamKey] = useState('');
  const [externalKey, setExternalKey] = useState('');

  // 체크된 문제 번호들을 배열 형태로 저장
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  // 문제 유형별 체크 여부와 개수를 관리하는 객체
  const [questionSettings, setQuestionSettings] = useState<Record<string, QuestionSetting>>({});

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copyLabel, setCopyLabel] = useState('📋 클립보드에 복사');
  const [translationPrompt, setTranslationPrompt] = useState('');
  const [copyTranslationLabel, setCopyTranslationLabel] = useState('📋 클립보드에 복사');
  const [studyNotePrompt, setStudyNotePrompt] = useState('');
  const [copyStudyNoteLabel, setCopyStudyNoteLabel] = useState('📋 클립보드에 복사');

  // 문제 번호 체크박스 클릭 핸들러
  const handleQuestionNoToggle = (num: number) => {
    if (IMAGE_REQUIRED_NOS.includes(num)) {
      const willCheck = !selectedQuestions.includes(num);
      if (willCheck) {
        alert(`${num}번은 도표/이미지가 필요한 문제입니다.\nGemini에 프롬프트를 붙여넣을 때 이미지를 직접 업로드해주세요.`);
      }
    }
    setSelectedQuestions((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  // 문제 유형 체크박스 / 개수 변경 핸들러
  const handleTypeChange = (id: string, field: 'checked' | 'count', value: boolean | number) => {
    setQuestionSettings((prev) => ({
      ...prev,
      [id]: {
        checked: prev[id]?.checked ?? false,
        count: prev[id]?.count ?? 1,
        [field]: value,
      },
    }));
  };

  // 전체 선택
  const selectAllTypes = () => {
    const all = [...QUESTION_TYPES, ...SUBJECTIVE_TYPES];
    setQuestionSettings((prev) =>
      Object.fromEntries(
        all.map(({ id }) => [id, { checked: true, count: prev[id]?.count ?? 1 }])
      )
    );
  };

  // 주관식만 선택
  const selectSubjectiveOnly = () => {
    setQuestionSettings((prev) => {
      const next = { ...prev };
      QUESTION_TYPES.forEach(({ id }) => { next[id] = { checked: false, count: next[id]?.count ?? 1 }; });
      SUBJECTIVE_TYPES.forEach(({ id }) => { next[id] = { checked: true, count: next[id]?.count ?? 1 }; });
      return next;
    });
  };

  // 전체 해제
  const deselectAllTypes = () => {
    setQuestionSettings((prev) =>
      Object.fromEntries(Object.entries(prev).map(([id, s]) => [id, { ...s, checked: false }]))
    );
  };

  // 외부 지문 프리셋 변경 시 textarea 자동 채우기
  const handleExternalKeyChange = (key: string) => {
    setExternalKey(key);
    if (key) {
      setPassageText(getExternalPassageText(key, EXTERNAL_REGISTRY));
    } else {
      setPassageText('');
    }
  };

  // 프롬프트 생성 — geminiForm.ts의 순수 함수를 호출
  const handleGenerate = () => {
    const { prompt, error } = generatePromptText({
      examType,
      difficultyLevel,
      modification,
      passageSource,
      questionSettings,
      examKey,
      selectedNos: selectedQuestions,
      externalKey,
      passageText,
      examRegistry: EXAM_REGISTRY,
      externalRegistry: EXTERNAL_REGISTRY,
    });

    if (error) {
      alert(error);
      return;
    }
    setGeneratedPrompt(prompt!);
  };

  // 외부지문해석 프롬프트 생성
  const handleTranslationGenerate = () => {
    const { translationPrompt: tp, studyNotePrompt: sp, error } = generateTranslationPrompt({
      passageText,
      externalKey,
      externalRegistry: EXTERNAL_REGISTRY,
    });

    if (error) {
      alert(error);
      return;
    }
    setTranslationPrompt(tp!);
    setStudyNotePrompt(sp!);
    setGeneratedPrompt('');
  };

  // 번역 워크시트 복사
  const copyTranslationPrompt = () => {
    navigator.clipboard.writeText(translationPrompt).then(() => {
      setCopyTranslationLabel('✅ 복사 완료!');
      setTimeout(() => setCopyTranslationLabel('📋 클립보드에 복사'), 2500);
    }).catch(() => {
      alert('복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
    });
  };

  // 해설 정리 노트 복사
  const copyStudyNotePrompt = () => {
    navigator.clipboard.writeText(studyNotePrompt).then(() => {
      setCopyStudyNoteLabel('✅ 복사 완료!');
      setTimeout(() => setCopyStudyNoteLabel('📋 클립보드에 복사'), 2500);
    }).catch(() => {
      alert('복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
    });
  };

  // 클립보드 복사
  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setCopyLabel('✅ 복사 완료!');
      setTimeout(() => setCopyLabel('📋 클립보드에 복사'), 2500);
    }).catch(() => {
      alert('복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
    });
  };

  return (
    <div className="container">
      <h2>🤖 Gemini 프롬프트 생성기</h2>
      <p className="subtitle">파라미터를 설정하고 프롬프트를 생성하여 Gemini 웹에 붙여넣으세요.</p>

      <div className="form-layout">
        {/* 왼쪽 컬럼 */}
        <div className="left-column">
          <div className="form-card">
            <label className="form-label">📚 시험 과목 선택 (택 1)</label>
            <div className="radio-group">
              <label><input type="radio" name="examType" value="모의고사" checked={examType === '모의고사'} onChange={(e) => { setExamType(e.target.value); setPassageSource('regular'); }} />모의고사</label>
              <label><input type="radio" name="examType" value="외부지문" checked={examType === '외부지문'} onChange={(e) => { setExamType(e.target.value); setPassageSource('external'); }} />외부 지문</label>
              <label><input type="radio" name="examType" value="교과서" checked={examType === '교과서'} onChange={(e) => { setExamType(e.target.value); setPassageSource('external'); }} />교과서</label>
            </div>
          </div>

          <div className="form-card">
            <label className="form-label">📋 프롬프트 템플릿 선택</label>
            <div className="radio-group" style={{ flexDirection: 'column' }}>
              <label style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="radio" name="passageSource" value="regular" checked={passageSource === 'regular'} onChange={(e) => setPassageSource(e.target.value)} />
                수능/모의고사 기출용 (Alice 모의고사)
              </label>
              <label style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="radio" name="passageSource" value="external" checked={passageSource === 'external'} onChange={(e) => setPassageSource(e.target.value)} />
                외부 지문 내신용 (Alice 내신 모의고사)
              </label>
            </div>
          </div>

          {/* 🔴 examType이 '모의고사'일 때만 화면에 보여주도록 처리합니다. */}
          {examType === '모의고사' && (
            <div className="form-card" id="mock-number-card">
              <label className="form-label">📌 출제할 문제 번호 선택 (다중 선택 가능)</label>
              <div className="number-grid">
                {Array.from({ length: 28 }, (_, i) => i + 18).map((num) => (
                  <div key={num}>
                    <input type="checkbox" id={`q_num_${num}`} className="hidden-cb" checked={selectedQuestions.includes(num)} onChange={() => handleQuestionNoToggle(num)} />
                    <label htmlFor={`q_num_${num}`} className="number-label">{num}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-card" id="passage-input-card">
            <label className="form-label" id="passage-label">
              {examType === '모의고사' ? '📄 모의고사 선택' : '📄 지문 선택 / 직접 입력'}
            </label>

            {examType === '모의고사' ? (
              <div id="exam-select-wrapper">
                <select className="exam-select" value={examKey} onChange={(e) => setExamKey(e.target.value)}>
                  <option value="">-- 시험지를 선택하세요 --</option>
                  {Object.entries(EXAM_REGISTRY).map(([key, exam]) => (
                    <option key={key} value={key}>{exam.label}</option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div id="external-select-wrapper">
                  <select className="exam-select" value={externalKey} onChange={(e) => handleExternalKeyChange(e.target.value)}>
                    <option value="">-- 프리셋 지문 선택 (선택사항) --</option>
                    {Object.entries(EXTERNAL_REGISTRY).map(([key, item]) => (
                      <option key={key} value={key}>{item.label}</option>
                    ))}
                  </select>
                  <p style={{ fontSize: '13px', color: '#6c757d', margin: '8px 0 12px 2px' }}>
                    ↑ 선택하거나, 아래에 직접 붙여넣기 (둘 중 하나만 있으면 됩니다)
                  </p>
                </div>
                <div id="text-area-wrapper">
                  <textarea
                    placeholder="여기에 영어 지문을 붙여넣으세요..."
                    value={passageText}
                    onChange={(e) => setPassageText(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="form-card">
            <label className="form-label">🌟 난이도 선택</label>
            <div className="radio-group" style={{ flexDirection: 'column' }}>
              <label style={{ textAlign: 'left' }}>
                <input type="radio" name="difficultyLevel" value="하" checked={difficultyLevel === '하'} onChange={(e) => setDifficultyLevel(e.target.value)} />
                {' '}하 (기본적인 내용 파악)
              </label>
              <label style={{ textAlign: 'left' }}>
                <input type="radio" name="difficultyLevel" value="중" checked={difficultyLevel === '중'} onChange={(e) => setDifficultyLevel(e.target.value)} />
                {' '}중 (수능/내신 평균 수준)
              </label>
              <label style={{ textAlign: 'left' }}>
                <input type="radio" name="difficultyLevel" value="상" checked={difficultyLevel === '상'} onChange={(e) => setDifficultyLevel(e.target.value)} />
                {' '}상 (매력적인 오답이 포함된 고난도)
              </label>
            </div>
          </div>

          <div className="form-card">
            <label className="form-label">🔄 지문 변형 여부</label>
            <div className="radio-group" style={{ flexDirection: 'column' }}>
              <label style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="radio" name="modification" value="원본그대로" checked={modification === '원본그대로'} onChange={(e) => setModification(e.target.value)} />
                원본 지문 그대로 출제
              </label>
              <label style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="radio" name="modification" value="지문변형" checked={modification === '지문변형'} onChange={(e) => setModification(e.target.value)} />
                지문 변형 출제 (유의어 대체, 문장 구조 변경 등)
              </label>
            </div>
          </div>

        </div>

        {/* 오른쪽 컬럼 */}
        <div className="right-column">
          <div className="form-card">
            <div className="question-type-header">
              <label className="form-label">🎯 문제 유형 및 개수 선택</label>
              <div className="select-all-btns">
                <button type="button" className="btn-select-all" onClick={selectAllTypes}>유형 모두 선택</button>
                <button type="button" className="btn-select-subjective" onClick={selectSubjectiveOnly}>주관식만 선택</button>
                <button type="button" className="btn-deselect-all" onClick={deselectAllTypes}>전체 해제</button>
              </div>
            </div>
            
            <div className="checkbox-group">
              {/* 🔴 배열 데이터를 활용하여 화면을 반복해서 그려줍니다. */}
              {QUESTION_TYPES.map((type) => (
                <div className="checkbox-item" key={type.id}>
                  <label>
                    <input type="checkbox" checked={questionSettings[type.id]?.checked || false} onChange={(e) => handleTypeChange(type.id, 'checked', e.target.checked)} />
                    {type.label}
                  </label>
                  <div>
                    <input type="number" className="number-input" min="1" max="10" value={questionSettings[type.id]?.count || 1} onChange={(e) => handleTypeChange(type.id, 'count', Number(e.target.value))} /> 개
                  </div>
                </div>
              ))}

              <div className="checkbox-item subjective-divider">
                <span className="subjective-label">── 주관식 ──</span>
              </div>

              {SUBJECTIVE_TYPES.map((type) => (
                <div className="checkbox-item" key={type.id}>
                  <label>
                    <input type="checkbox" checked={questionSettings[type.id]?.checked || false} onChange={(e) => handleTypeChange(type.id, 'checked', e.target.checked)} />
                    {type.label}
                  </label>
                  <div>
                    <input type="number" className="number-input" min="1" max="10" value={questionSettings[type.id]?.count || 1} onChange={(e) => handleTypeChange(type.id, 'count', Number(e.target.value))} /> 개
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button type="button" className="btn-generate" onClick={handleGenerate}>프롬프트 생성하기 ✨</button>
        {examType !== '모의고사' && (
          <button type="button" className="btn-generate" style={{ background: '#2d6a4f' }} onClick={handleTranslationGenerate}>
            외부지문 해석 워크시트 생성 📝
          </button>
        )}
      </div>

      {generatedPrompt && (
        <div id="prompt-output-section">
          <div className="prompt-output-header">
            <span className="prompt-output-title">생성된 프롬프트</span>
            <button className="btn-copy" onClick={copyPrompt}>{copyLabel}</button>
          </div>
          <textarea className="prompt-output-textarea" readOnly value={generatedPrompt}></textarea>
          <p className="prompt-hint">위 프롬프트를 복사하여 <strong>Gemini 웹(gemini.google.com)</strong>에 붙여넣으세요.</p>
        </div>
      )}

      {translationPrompt && (
        <div id="prompt-output-section">
          <div className="prompt-output-header">
            <span className="prompt-output-title">📝 외부지문 해석 프롬프트</span>
            <button className="btn-copy" onClick={copyTranslationPrompt}>{copyTranslationLabel}</button>
          </div>
          <textarea className="prompt-output-textarea" readOnly value={translationPrompt}></textarea>
          <p className="prompt-hint">위 프롬프트를 복사하여 <strong>Gemini 웹(gemini.google.com)</strong>에 붙여넣으세요.</p>
        </div>
      )}

      {studyNotePrompt && (
        <div id="prompt-output-section" style={{ marginTop: '16px' }}>
          <div className="prompt-output-header">
            <span className="prompt-output-title">📚 외부지문 해설 및 정리 노트 프롬프트</span>
            <button className="btn-copy" onClick={copyStudyNotePrompt}>{copyStudyNoteLabel}</button>
          </div>
          <textarea className="prompt-output-textarea" readOnly value={studyNotePrompt}></textarea>
          <p className="prompt-hint">위 프롬프트를 복사하여 <strong>Gemini 웹(gemini.google.com)</strong>에 붙여넣으면 노션용 해설 정리 자료가 생성됩니다.</p>
        </div>
      )}

    </div>
  );
}