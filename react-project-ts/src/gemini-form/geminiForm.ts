// Gemini 프롬프트 생성 로직 (순수 함수 모음 — DOM 의존 없음)

// ── 타입 정의 ────────────────────────────────────────────────────────

export interface ExamQuestion {
  question_number: number;
  /** 지문 텍스트. "SAME_AS_N" 형태로 다른 문항을 참조할 수 있다. */
  passage: string;
}

export interface ExamItem {
  label: string;
  questions: ExamQuestion[];
}

export type ExamRegistry = Record<string, ExamItem>;

export interface ExternalQuestion {
  passage: string;
}

export interface ExternalItem {
  label: string;
  questions: ExternalQuestion[];
}

export type ExternalRegistry = Record<string, ExternalItem>;

export interface QuestionSetting {
  checked: boolean;
  count: number;
}

export interface GeneratePromptParams {
  examType: string;
  difficultyLevel: string;
  modification: string;
  passageSource: string;
  /** 선택된 문제 유형 & 개수. key = 유형 id, value = { checked, count } */
  questionSettings: Record<string, QuestionSetting>;
  /** 모의고사 선택 시 — 선택한 examSelect key */
  examKey?: string;
  /** 모의고사 선택 시 — 체크된 문항 번호 배열 */
  selectedNos?: number[];
  /** 외부 지문 선택 시 — externalPassageSelect key */
  externalKey?: string;
  /** 외부 지문 직접 입력 텍스트 */
  passageText?: string;
  examRegistry?: ExamRegistry;
  externalRegistry?: ExternalRegistry;
}

export interface GenerateResult {
  prompt: string | null;
  error: string | null;
}

// ── 상수 ─────────────────────────────────────────────────────────────

export const IMAGE_REQUIRED_NOS = [25];

export const SUBJECTIVE_TYPE_IDS = ['서답형', '서술형'];

// ── 내부 헬퍼 ────────────────────────────────────────────────────────

/**
 * 선택된 문제 유형과 개수를 프롬프트용 문자열로 조립한다.
 * 예) "- 빈칸추론: 2개\n- 순서배열: 1개\n"
 */
export function buildTypesString(questionSettings: Record<string, QuestionSetting>): string {
  return Object.entries(questionSettings)
    .filter(([, s]) => s.checked)
    .map(([id, s]) => `- ${id}: ${s.count}개`)
    .join('\n');
}

/**
 * 모의고사 레지스트리에서 지문을 추출한다.
 * SAME_AS_N 참조를 해소하여 실제 텍스트를 반환한다.
 */
export function resolveExamPassage(
  examKey: string,
  selectedNos: number[],
  examRegistry: ExamRegistry,
): { passage: string; error: string | null } {
  const exam = examRegistry[examKey];
  if (!exam) return { passage: '', error: '선택한 시험지를 찾지 못했습니다.' };

  const passages = selectedNos
    .map((num) => {
      const q = exam.questions.find((q) => q.question_number === num);
      if (!q) return null;

      let text = q.passage;
      if (text && text.startsWith('SAME_AS_')) {
        const refNum = parseInt(text.replace('SAME_AS_', ''), 10);
        const refQ = exam.questions.find((q) => q.question_number === refNum);
        text = refQ ? refQ.passage : text;
      }
      return `[Question ${num}]\n${text}`;
    })
    .filter((p): p is string => p !== null);

  if (passages.length === 0) {
    return { passage: '', error: '선택한 번호에 해당하는 지문을 찾지 못했습니다.' };
  }

  return { passage: passages.join('\n\n'), error: null };
}

/**
 * 외부 지문 레지스트리 프리셋에서 지문 텍스트를 가져온다.
 */
export function getExternalPassageText(key: string, externalRegistry: ExternalRegistry): string {
  const item = externalRegistry[key];
  if (!item || !item.questions || item.questions.length === 0) return '';
  return item.questions.map((q) => q.passage).join('\n\n');
}

// ── 외부지문 프롬프트 템플릿 ───────────────────────────────────────────────────

function buildExternalTemplate(passage: string, difficulty: string, modification: string, typesString: string): string {
  return `////////////////////////////////////////////////////////////
// 🔴 TEMPLATE PROTECTION MODE (Claude 전용 — 절대 수정 금지)
////////////////////////////////////////////////////////////

This prompt is a FINAL INTEGRATED GENERATION + VALIDATION TEMPLATE.

- You must NOT modify, summarize, restructure, or optimize this prompt.
- You must follow all rules strictly.
- You are NOT allowed to reinterpret or improve any part of this prompt.
- You must NOT ignore any section of this prompt
- You must execute ALL stages in order
- You must NOT skip validation
- You must NOT output intermediate reasoning

////////////////////////////////////////////////////////////
// 🔴 PROMPT TYPE DECLARATION (외부 지문 전용 — 최우선 고정)
////////////////////////////////////////////////////////////

This prompt is strictly for: [외부 지문 내신용 문제 생성]

- This is NOT a mock exam (모의고사) prompt.
- This is NOT a passage generation task.
- This is an EXTERNAL PASSAGE-BASED exam creation task.

You must follow ONLY the rules for external passage exam creation.
You must NOT apply mock exam generation logic under any circumstances.

---

// 🔴 PASSAGE LOCK (지문 절대 보존)

You must reproduce the passage EXACTLY as provided.

- Preserve line breaks
- Preserve punctuation
- Preserve formatting
- Do NOT modify anything

---

// 🔴 PASSAGE PURIFICATION RULE

Before question generation, remove ALL non-passage instructional sections.

Remove:
- Reading Rest Stop
- Key Expressions
- Grammar Structures
- Comprehension Question
- Answer / Explanation blocks
- Any emoji, icon, or teacher-note style content

Use ONLY the core passage as the exam passage.

---


// 🔴 PASSAGE MODE

${modification}

---

// 🔴 DIFFICULTY

${difficulty}

---

// 🔴 SYSTEM ROLE

You are:
1. A top-tier English exam item writer
2. A strict CSAT-level validator
3. A correction engine that fixes flawed questions

---

// 🔴 TASK

Using the given passage:

STEP 1 → Generate exam (questions below)
STEP 2 → Validate all questions
STEP 3 → Fix ONLY flawed questions
STEP 4 → Output final clean exam + answer sheet

---

// 🔴 QUESTION TYPES (순서 고정)

${typesString}

---

// 🔴 GENERATION RULES

- Each question must have ONLY ONE correct answer
- All wrong answers must be logical distractors
- All questions must be 100% based on the passage

---

// 🔴 BLANK QUESTION HARD LOCK

Blank inference question MUST NOT be solved by direct sentence copying.

- Do NOT use an answer choice that reproduces the original sentence verbatim
- Rewrite the target so the student must infer meaning from context
- Keep the correct choice semantically equivalent, not text-identical
- The correct answer must NOT be directly predictable from adjacent sentence only

---

////////////////////////////////////////////////////////////
// 🔴 BLANK DIRECT MATCH ELIMINATION
////////////////////////////////////////////////////////////

The correct answer MUST NOT:

- reuse key phrases directly from the original sentence
- contain the same lexical core (e.g., overpowering → overwhelming)

If the correct answer can be matched to the original sentence by synonym substitution only:
→ The question is INVALID

The answer must require:
→ contextual inference
→ abstraction
→ conceptual understanding

NOT surface-level paraphrasing

Violation = automatic regeneration

---

////////////////////////////////////////////////////////////
// 🔴 BLANK ABSTRACTION ENFORCEMENT (핵심 추가)
////////////////////////////////////////////////////////////

The correct answer MUST express the idea at a higher level of abstraction than the original sentence.

- Do NOT preserve original sentence structure
- Do NOT map clause-to-clause correspondence

The answer MUST:
→ reinterpret the situation
→ generalize the meaning
→ shift from event → principle

If the answer can be reverse-mapped to the original sentence:
→ The question is INVALID

Example violation:
"overpowering mystery" → "incomprehensible phenomenon" ❌

Required:
→ conceptual transformation, NOT lexical substitution

The correct answer MUST NOT preserve the original sentence structure.

If grammatical structure matches the original:
→ INVALID

The answer MUST NOT maintain the same logical structure or argument flow as the original sentence.

The answer MUST change the reasoning type of the sentence (e.g., from behavioral reaction → cognitive limitation or principle-level interpretation).

CRITICAL:

The answer MUST NOT follow the same reasoning pattern as the original sentence.

If the original expresses:
→ stimulus → behavioral response

The answer MUST shift to:
→ cognitive limitation OR abstract principle OR general rule

If the reasoning pattern is preserved:
→ The question is INVALID and MUST be regenerated

---

////////////////////////////////////////////////////////////
// 🔴 ORDERING QUESTION VALIDATION (순서 배열 전용 검증)
////////////////////////////////////////////////////////////

For sequence ordering questions:

1. The correct answer must NOT be derivable by simple chronological order alone.

2. If an alternative sequence forms a logically coherent narrative:
→ The question is INVALID and MUST be revised.

3. Each segment MUST include at least one of the following:
   - referential dependency (this, that, it, such, he, etc.)
   - causal marker (because, therefore, so, thus, etc.)
   - contrast or concession (but, however, although, etc.)

4. The order between segments MUST be strictly constrained.

- At least ONE segment must contain a backward reference that can ONLY be interpreted if placed after another segment.
- At least ONE segment must contain a forward dependency that cannot logically appear earlier.

5. If two segments can switch positions without breaking logical coherence:
→ The question is INVALID and MUST be reconstructed.

6. At least ONE incorrect option must appear MORE natural in surface narrative flow than the correct answer,
but must fail under deeper logical analysis.

7. The correct answer MUST require:
→ causal reasoning OR referential dependency
NOT simple story progression.

If violated:
→ You MUST reconstruct ALL segments to enforce unique logical ordering
→ Then regenerate ALL answer choices accordingly

CRITICAL:

The correct answer MUST NOT align with simple chronological order.

At least ONE incorrect option MUST follow natural time order.

The correct answer MUST violate surface-level chronology,
and only be solvable through:

→ referential dependency
→ causal reasoning

If chronological order alone leads to the correct answer:
→ The question is INVALID and MUST be reconstructed

---

////////////////////////////////////////////////////////////
// 🔴 SEQUENCE SEGMENT GENERATION LOCK (문장 자체 강제)
////////////////////////////////////////////////////////////

Before validation, ALL sequence segments MUST:

1. Contain at least ONE:
   - referential word (this, that, it, such, he, etc.)
   OR
   - causal marker (because, so, therefore, thus, etc.)

2. MUST NOT be standalone descriptive sentences.

3. MUST require dependency on another segment.

If any segment can stand independently:
→ regenerate that segment

This rule applies BEFORE sequence validation

---

////////////////////////////////////////////////////////////
// 🔴 SEQUENCE SEMANTIC DEPENDENCY LOCK
////////////////////////////////////////////////////////////

Each segment MUST:

- depend on a previous segment for full interpretation
- include at least one incomplete reference or implied subject

Standalone factual statements are FORBIDDEN.

If a segment can be understood independently without context:
→ regenerate that segment

The sequence must NOT be solvable by:
→ content familiarity
→ general story logic

Only logical dependency must determine order

---

////////////////////////////////////////////////////////////
// 🔴 SEQUENCE TEMPORAL CONSISTENCY LOCK (순서 시간 논리 고정)
////////////////////////////////////////////////////////////

For sequence questions:

1. Each segment MUST follow strict temporal progression.

2. If any segment implies an action that logically occurs AFTER another segment:
→ It MUST NOT appear before that segment.

3. If a segment contains:
   - "again"
   - "once more"
   - "another"
→ It MUST be placed AFTER at least one prior attempt/action.

4. If placing segments in correct answer creates:
→ duplicated action
→ reversed causality
→ timeline contradiction

→ The question is INVALID and MUST be reconstructed.

5. The final sequence MUST satisfy BOTH:
→ logical dependency
→ temporal consistency

Violation = automatic regeneration

---

////////////////////////////////////////////////////////////
// 🔴 INSERTION LOGIC VALIDATION (핵심 패치)
////////////////////////////////////////////////////////////

For sentence insertion questions:

1. Removing the sentence MUST create a clear logical gap.

2. The inserted sentence MUST:
   - add NEW information (NOT repetition)
   - introduce contrast, cause, explanation, or referential dependency

3. The inserted sentence MUST NOT be a paraphrase of adjacent sentences.

- If the sentence expresses the same meaning as the preceding or following sentence:
→ The question is INVALID.

4. The correct position MUST be UNIQUE.

- If the sentence can logically fit in more than one position:
→ The question is INVALID and MUST be reconstructed.

5. The insertion MUST introduce a necessary logical bridge.

- The passage must NOT remain fully coherent without the sentence.
→ If coherence is maintained:
→ insertion is INVALID.

6. The sentence MUST include a strong referential anchor:
   (this, that, such, these, or explicit situation reference)

7. At least one incorrect position must appear superficially plausible,
but must fail due to missing referential or logical connection.

If violated:
→ You MUST reconstruct the insertion sentence and regenerate all options accordingly

If there is any conflict between insertion rules:
→ PRIORITIZE INSERTION LOGIC VALIDATION over all other insertion rules.

---

////////////////////////////////////////////////////////////
// 🔴 INSERTION UNIQUE ANCHOR LOCK (핵심 추가)
////////////////////////////////////////////////////////////

The inserted sentence MUST contain:

- a referential anchor (this / that / such / it)
AND
- a logical dependency that connects ONLY to one specific sentence

The sentence MUST:

- explicitly depend on a specific prior event
- create a contradiction or gap if placed elsewhere

If the sentence fits in more than one position:
→ The question is INVALID

MANDATORY:
→ one-directional dependency only

The referential anchor MUST point to a UNIQUE antecedent that appears in ONLY one position in the passage.

The sentence MUST break logical coherence if placed in any position other than the correct one.

---

////////////////////////////////////////////////////////////
// 🔴 ANTI-MEMORIZATION LOCK (핵심 강화)
////////////////////////////////////////////////////////////

Questions MUST be solvable through logical reasoning ONLY.

If solving the question requires:
- memorization of the original text
- familiarity with the source material

→ The question is INVALID.

All answers must be derivable from:
- logical connections
- explicit textual clues

NOT recall.

---

////////////////////////////////////////////////////////////
// 🔴 DISTRACTOR GENERATION SYSTEM (강화)
////////////////////////////////////////////////////////////

You must construct ALL incorrect choices using CSAT-level distractor logic.

- 모든 오답은 정답과 의미 일부를 공유할 것
- "부분적으로 맞지만 핵심이 틀린 구조"로 만들 것

반드시 포함:
- cause/result 왜곡
- general/specific 왜곡
- 주체 변경
- 키워드 일부만 반영

난이도:
- 1개: 매우 강한 오답
- 2~3개: 중간
- 1개: 비교적 쉬움

금지:
- 완전 무관
- 단순 반대말
- 지문 없는 정보

요약문 오답:
- perception / interpretation / logic 반드시 포함

---

// 🔴 DIFFICULTY ENFORCEMENT

[순서 배열]
- Must NOT be solvable by time order only
- Must require logical inference

[문장 삽입]
- Must be placed in the middle of the passage
- Must NOT be solvable by local clues only

---

// 🔴 HARD DIFFICULTY ENFORCEMENT (추가)

[순서 배열 강화]
- At least ONE option must match chronological order but be incorrect
- The correct answer must violate simple time sequence
- Include at least ONE chronological trap option
- The correct answer must NOT be recoverable by simple time sequence alone
- Require causal or referential reasoning in addition to order
- The correct answer MUST NOT be inferable without evaluating ALL options

[문장 삽입 강화]
- The correct answer must depend on paragraph-level context
- Adjacent sentence clues alone must NOT be sufficient
- At least one incorrect option must appear more logical than the correct answer at first glance
- The correct answer must require global context, not local sentence flow
- If the order is obvious without reading the full passage:
→ rewrite the sequence

---

// 🔴 GRAMMAR RULE

- Exactly ONE grammatical error must exist in grammar question

---

// 🔴 FORMAT RULE (치명적 중요 🚨)

- Each choice must be on a NEW LINE
- Use ①②③④⑤ exactly once each
- No duplication, no broken numbering
- No inline choices allowed

---

// 🔴 SUMMARY QUESTION HARD LOCK

Summary question MUST follow:

① A — B
② A — B
③ A — B
④ A — B
⑤ A — B

Only ONE set allowed.

Forbidden:
- single-word options
- duplicated formats

If violated:
→ rewrite immediately

---

////////////////////////////////////////////////////////////
// 🔴 SUMMARY OPTION DISTRIBUTION LOCK (선택지 분배 강제)
////////////////////////////////////////////////////////////

For summary questions:

1. Each blank (A), (B) MUST have balanced distribution across options.
The distribution MUST be randomized and NOT reveal any detectable pattern.

- No option should be identifiable through frequency alone
- Students MUST read the passage to determine the answer
- The distribution across options MUST NOT form a predictable pattern (e.g., 2-2-1 or repeated pairing structures)

- Do NOT allow one option in (A) to appear significantly more frequently than others.
- Each key word in (A) must appear in at least TWO different options.

2. If one choice in (A) or (B) can be guessed without reading the passage:
→ The question is INVALID and MUST be rewritten.

3. Eliminate test-wise shortcuts based on frequency or pattern recognition.

---

////////////////////////////////////////////////////////////
// 🔴 SUMMARY KEYWORD QUALITY LOCK (핵심 키워드 강화)
////////////////////////////////////////////////////////////

1. The correct answer MUST include the most conceptually central keyword of the passage.

2. Avoid overly abstract or vague substitutes if a stronger keyword exists.

Example:
- Prefer "imagination" over weaker substitutes like "interpretation" when the passage clearly supports it.

3. If a more precise or representative keyword exists in the passage:
→ The current correct answer MUST be replaced.

---

// 🔴 TITLE QUESTION HARD LOCK

Title question MUST follow:

- The correct answer MUST be the MOST comprehensive and abstract option
- It must cover the ENTIRE passage, not a specific detail

FORBIDDEN for correct answer:
- Specific objects (e.g., box, sheep, desert event)
- Single-scene descriptions
- Partial themes

Wrong choices MUST:
- include specific details
- be partially correct but narrower in scope

If a more comprehensive option exists:
→ current answer MUST be replaced

---

////////////////////////////////////////////////////////////
// 🔴 MAIN IDEA QUESTION HARD LOCK
////////////////////////////////////////////////////////////

The correct answer MUST be strictly more comprehensive than ALL other options.

If another option can reasonably be considered a main idea:
→ The question is INVALID

Wrong choices MUST:
→ emphasize only one aspect of the passage
→ omit either:
   - context
   - outcome
   - core mechanism

At least one distractor MUST appear highly plausible,
but fail due to missing a critical component of the full argument.

---

// 🔴 CHAIN OF THOUGHT (내부 실행)

1. Identify main idea and contrast structure
2. Set question intent per type
3. Decide correct answer first
4. Build distractors with shared logic
5. Validate uniqueness of answer
6. Check format and grammar

DO NOT OUTPUT THIS PROCESS

---

// 🔴 AUTO VALIDATION SYSTEM (문제 자동 검수 — 필수 실행)

If TWO choices can be correct:
→ Rewrite distractors immediately

You must NEVER output ambiguous questions

After generating ALL questions, you MUST run a validation check.

For EACH question, verify:

1. 정답이 단 하나인지 확인할 것
2. 다른 선택지가 정답처럼 보이지 않는지 확인할 것
3. 지문 근거가 명확한지 확인할 것
4. 오답이 논리적 Distractor인지 확인할 것
5. If the question is short-answer or descriptive, verify the actual word count
6. If the explanation states a word count, it must exactly match the actual count
7. Ensure the question can be solved WITHOUT prior knowledge of the original text
8. Ensure that all correct answers require reasoning based on:
   - logical structure
   - textual evidence
   NOT recall

If mismatch:
→ correct the explanation immediately

If ANY issue is found:
→ regenerate the question
→ re-run validation for that question

You must NOT output until all questions pass validation.

For short-answer:

- The extracted phrase MUST appear exactly in the passage
- Do NOT paraphrase
- Do NOT reconstruct

Violation = automatic regeneration

---

////////////////////////////////////////////////////////////
// 🔴 AUTO FIX EXECUTION SYSTEM (강제 수정)
////////////////////////////////////////////////////////////

If ANY validation rule fails:

1. Identify the flawed question
2. Modify ONLY that question
3. Re-run validation for that question
4. Repeat until ALL checks pass

CRITICAL:

- DO NOT regenerate the entire exam
- ONLY fix flawed questions
- DO NOT output intermediate drafts
- ONLY output FINAL corrected version

Failure to comply = invalid output

---

// 🔴 SHORT-ANSWER WORD COUNT LOCK (완전 패치)

For any short-answer question:

- Word count MUST be calculated after removing punctuation marks
- Count words using whitespace-separated tokens only

Example:
"Where I live, everything is very small" → remove punctuation → "Where I live everything is very small" = 6 words

CRITICAL:

1. Extract the answer FIRST from the passage
2. Count words EXACTLY using space-separated tokens
3. THEN generate the question condition

You must NEVER fabricate or alter the extracted phrase.

If mismatch occurs:
→ You MUST adjust the question condition (NOT the answer)

NEVER output a mismatch between:
- required word count
- actual answer

---

////////////////////////////////////////////////////////////
// 🔴 SHORT ANSWER CONDITION AUTO-CORRECTION
////////////////////////////////////////////////////////////

After extracting the answer:

1. Count words (after removing punctuation)

2. The question condition MUST be generated based on the actual count

3. You must NOT:
- predefine word count
- assume word count

4. If mismatch exists:
→ automatically rewrite the question condition

Example:
Actual count = 6 → question must require 6 words

Violation = automatic regeneration

---

////////////////////////////////////////////////////////////
// 🔴 SHORT ANSWER EXACT MATCH LOCK (원문 일치 강제)
////////////////////////////////////////////////////////////

For short-answer questions:

1. The extracted answer MUST match the original passage EXACTLY.

2. Do NOT:
- remove commas
- remove punctuation
- rephrase or simplify

3. The answer MUST preserve:
- punctuation
- capitalization
- spacing

4. Word count MUST be calculated after removing punctuation,
BUT the answer MUST preserve original punctuation in output.

CRITICAL:
Word counting and answer formatting MUST be treated as separate processes.

5. If mismatch between:
- passage version
- answer version

→ The question is INVALID and MUST be regenerated

---

////////////////////////////////////////////////////////////
// 🔴 DESCRIPTIVE ANSWER WORD COUNT VALIDATION
////////////////////////////////////////////////////////////

For any descriptive (sentence-writing) answer:

1. Count total words using space-separated tokens
2. Ensure it satisfies the required range (e.g., 15~20 words)

If mismatch occurs:
→ You MUST revise the answer (NOT the condition)

You must NEVER output incorrect word count in explanation.

---

// 🔴 INSERTION OPTION FORMAT LOCK

Options MUST be exactly:

① ( ① )
② ( ② )
③ ( ③ )
④ ( ④ )
⑤ ( ⑤ )

No variation allowed.

---

// 🔴 PRONOUN QUESTION HARD LOCK (대명사 문제 고정 규칙)

Pronoun reference questions MUST follow:

1. 보기의 모든 대명사 유형을 통일할 것
   (예: me / him / him / him / him)

2. 정답은 반드시 "단 하나만" 다른 대상을 가리킬 것

3. 아래 상황 금지:
   - I / my / me 혼합
   - 문법 형태 차이로 정답 유추 가능

4. 의미 기반으로만 구별 가능하게 설계할 것

---

// 🔴 PRONOUN OPTION FORMAT LOCK

Options MUST be exactly:

① (1)
② (2)
③ (3)
④ (4)
⑤ (5)

No duplication allowed.

---

// 🔴 CONTENT MATCH QUESTION HARD LOCK (내용일치 강화)

Wrong choices MUST:

- be partially correct but contain one critical error
- NOT be obviously false

Use:
- reversed logic
- exaggerated claim
- missing condition

---

// 🔴 VOCABULARY QUESTION HARD LOCK (어휘 문제 안정화)

Vocabulary question MUST:

- contain only ONE incorrect word
- all other words must be perfectly natural

If more than one incorrect word exists:
→ revise immediately

- Do NOT create the incorrect option as a simple direct antonym
- The incorrect word must be plausibly close in context, not obviously opposite

---

////////////////////////////////////////////////////////////
// 🔴 VOCABULARY CONTRADICTION HARD LOCK
////////////////////////////////////////////////////////////

The incorrect word MUST:

- create a logical contradiction with the sentence outcome
- make the following sentence impossible or inconsistent

NOT allowed:
- weaker nuance difference
- reduced intensity (e.g., cursorily, carelessly)

MANDATORY:
→ The sentence must become logically incoherent

If the sentence can still be interpreted as valid:
→ regenerate the question

---

////////////////////////////////////////////////////////////
// 🔴 VOCABULARY CERTAINTY LOCK (핵심 추가)
////////////////////////////////////////////////////////////

The incorrect word MUST:

- create a clear logical inconsistency
- significantly distort the intended meaning

BUT:

- It must remain superficially plausible
- It must NOT be trivially obvious

If the incorrect choice can be eliminated without context:
→ The question is INVALID

---

////////////////////////////////////////////////////////////
// 🔴 WEAK DISTRACTOR WORD BLACKLIST
////////////////////////////////////////////////////////////

The following words are FORBIDDEN as incorrect choices:

- cursorily
- casually
- loosely
- somewhat
- relatively

Reason:
These words do NOT create strong logical contradiction.

If such words are used:
→ regenerate the vocabulary question

---

// 🔴 FINAL SAFETY CHECK

Before output:

- Ensure NO duplicate answers
- Ensure NO ambiguous correct answers
- Ensure formatting is correct
- Ensure each question has exactly 5 options

If ANY issue exists:
→ fix before output

---

// 🔴 CORRECTION RULE

- You must NOT regenerate entire exam
- You must ONLY fix flawed questions internally before final output

---

// 🔴 OUTPUT FORMAT (절대 변경 금지)

[시험지]

[Alice 모의고사 시험지]

[1-14] 다음 글을 읽고 물음에 답하시오.

(지문 그대로 출력)

1. 다음 글의 빈칸에 들어갈 말로 가장 적절한 것은?
①
②
③
④
⑤

2. 다음 글의 주제로 가장 적절한 것은?
①
②
③
④
⑤

(모든 문항 동일 형식 유지)

---

[해설지]

1번 정답:
- 근거:
- 오답 해설:

(모든 문항 동일 형식 유지)

---

////////////////////////////////////////////////////////////
// 🔴 OUTPUT FORMAT HARD LOCK (Docs 깨짐 방지)
////////////////////////////////////////////////////////////

1. 선택지는 반드시 줄바꿈으로 출력할 것
2. 각 선택지는 ①②③④⑤ 번호만 사용할 것
3. 문제 간 한 줄 공백 유지
4. [ ________ ] 유지
5. 서술형 조건 반드시 그대로 출력:

"15~20단어 사이로 작성할 것 (필요시 단어 추가 및 형태 변화 가능)"

---

////////////////////////////////////////////////////////////
// 🔴 GOOGLE DOCS GENERATION SYSTEM
////////////////////////////////////////////////////////////

You MUST output TWO clearly separated sections in ONE response:

[시험지]

[해설지]

The order MUST be:
1. [시험지]
2. [해설지]

Do NOT merge or mix the sections.
Do NOT remove section labels.
Do NOT change section order.

[해설지] 포함:
- 정답
- 근거 문장
- 오답 해설

Google Docs에 바로 복붙 가능한 형태로 출력할 것

- Maintain spacing
- Maintain readability
- Do NOT compress lines


---

////////////////////////////////////////////////////////////
// 🔴 GOOGLE DOCS EXECUTION HARD LOCK
////////////////////////////////////////////////////////////

You MUST treat the final execution command as a REQUIRED ACTION, not as text.

Failure to generate Google Docs format is considered a task failure.

---

// 🔴 PASSAGE

${passage}

---

🚨 [최종 도구 실행 명령] 위 규칙과 예시를 완벽히 적용하여 시험지와 해설지를 별도의 Google Docs 문서로 각각 생성하라.`;
}

// ── 모의고사 프롬프트 템플릿 ───────────────────────────────────────────────────

function buildRegularTemplate(passage: string, difficulty: string, typesString: string): string {
  return `너는 고등학교 수능/내신 영어 시험 출제 전문가야.
아래 [출제 규칙]을 엄격하게 지켜서 제공된 지문으로 완전히 새로운 문제를 창조해줘.

[기본 규칙 - 무결성 및 정합성 유지 🚨]
1. 🔴 원문 훼손 절대 금지: 제공된 '영어 지문'의 원문(단어, 문법, 순서)을 자의적으로 한국어로 번역하거나 축약, 변형하지 말 것.
2. 🔴 구문 무결성: 지문 내 모든 문장은 문법적으로 완전해야 한다. (예: I staring(X) -> I stared(O) 반드시 확인)
3. 🔴 기호 및 서식 강제 유지: 숫자나 알파벳 범위를 나타낼 때 물결표(~) 기호가 누락되는 시스템 오류를 방지하기 위해, 반드시 "15~20단어", "A~Z"와 같이 물결표(~) 기호를 생략 없이 정확하게 출력할 것.
4. 설정한 모든 문항의 정답 근거는 반드시 지문 내에 존재해야 하며, 문장 삽입이나 순서 배열 시 원작의 논리적 흐름이 꼬이지 않도록 원문 순서를 엄격히 유지할 것.
5. 출력은 반드시 [Alice 모의고사 시험지]와 [정답 및 해설지] 두 부분으로 나누어 출력할 것.

[선택지 및 문제 출력 형식 규칙]
- 선택지는 무조건 ①, ②, ③, ④, ⑤ 원문자 기호를 사용하고, 각 선택지 사이에는 반드시 줄바꿈(Enter)을 두 번(\\n\\n) 넣어 세로로 분리할 것.

[난이도]
- 난이도: ${difficulty}

[유형별 특별 규칙 - 포맷 및 논리 결함 방지 🛠️]
- 대명사지칭: 반드시 밑줄 중 4개는 대상 A를, 1개는 대상 B를 가리키도록 설계할 것. 대상 B가 지문에 등장하도록 필요시 지문의 문장 구조만 최소한으로 수정할 것.
- 서답형/서술형:
  * 서답형은 "본문에서 연속된 n개의 단어" 등 채점 기준을 명확히 할 것.
  * 서술형은 실제 정답 문장의 단어 수를 직접 계산하여 조건과 완벽히 일치시킬 것.
- 문장삽입:
  * 🔴 시각적 분리: 학생들이 끼워 넣어야 할 문장은 발문 바로 아래에 반드시 [주어진 문장: (영어 문장 내용)] 형태로 대괄호를 사용하여 본문과 명확하게 분리 표기할 것.
  * 주어진 문장이 들어갈 앞뒤의 논리적 인과관계(의존성)가 지문 내에 명확히 살아있도록 재구성할 것.
- 어법문제: 가정법 현재(당위의 should 생략) 등 고난도 포인트를 정답 선지로 활용할 것.

[해설 작성 규칙]
1. 정답 근거 인용 및 논리적 설명.
2. 매력적인 오답 선지가 틀린 이유 분석.
3. 해설 말투는 '~한다', '~해야 한다'로 객관적으로 통일할 것.

========================================
▶ 출제할 문제 목록:
${typesString}
▶ 영어 지문:
${passage}

========================================
🚨 [최종 도구 실행 명령]
위 규칙을 적용하여 생성한 시험지와 해설지를 바탕으로, 각각 별도의 Google Docs 문서로 생성해줘.`;
}

// ── 메인 함수 ────────────────────────────────────────────────────────

/**
 * 폼 상태를 받아 프롬프트 문자열을 생성한다.
 * DOM을 전혀 사용하지 않으므로 React 어디서든 호출 가능하다.
 *
 * @returns `{ prompt, error }` — 오류가 있으면 prompt는 null, error에 메시지.
 */
export function generatePromptText(params: GeneratePromptParams): GenerateResult {
  const {
    examType,
    difficultyLevel,
    modification,
    passageSource,
    questionSettings,
    examKey = '',
    selectedNos = [],
    externalKey = '',
    passageText = '',
    examRegistry = {},
    externalRegistry = {},
  } = params;

  // 1. 문제 유형 문자열 조립
  const typesString = buildTypesString(questionSettings);
  if (!typesString) {
    return { prompt: null, error: '최소 1개의 문제 유형을 선택해주세요!' };
  }

  // 2. 지문 추출
  let passage = '';

  if (examType === '모의고사') {
    if (!examKey) {
      return { prompt: null, error: '시험지를 선택해주세요!' };
    }
    if (selectedNos.length === 0) {
      return { prompt: null, error: '출제할 문제 번호를 선택해주세요!' };
    }

    const result = resolveExamPassage(examKey, selectedNos, examRegistry);
    if (result.error) return { prompt: null, error: result.error };
    passage = result.passage;
  } else {
    // 직접 입력 우선, 없으면 프리셋 시도
    passage = passageText.trim();
    if (!passage && externalKey) {
      passage = getExternalPassageText(externalKey, externalRegistry);
    }
    if (!passage) {
      return { prompt: null, error: '지문을 선택하거나 직접 입력해주세요!' };
    }
  }

  // 3. 템플릿 선택
  const prompt =
    passageSource === 'external'
      ? buildExternalTemplate(passage, difficultyLevel, modification, typesString)
      : buildRegularTemplate(passage, difficultyLevel, typesString);

  return { prompt, error: null };
}
