/* eslint-disable no-misleading-character-class */
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
// 🔴 BLANK DIRECT MATCH ELIMINATION & ABSTRACTION
////////////////////////////////////////////////////////////

The correct answer MUST NOT:
- reuse key phrases directly from the original sentence
- contain the same lexical core (e.g., overpowering → overwhelming)

The correct answer MUST express the idea at a higher level of abstraction than the original sentence.
- Do NOT preserve original sentence structure
- Do NOT map clause-to-clause correspondence
- MUST reinterpret the situation or generalize the meaning

If the reasoning pattern is preserved (e.g., original is stimulus->response, and answer is also stimulus->response):
→ The question is INVALID and MUST be regenerated.

---

////////////////////////////////////////////////////////////
// 🔴 SEQUENCE SEGMENT GENERATION LOCK (문장 자체 강제 - EXTREME)
////////////////////////////////////////////////////////////

Before validation, ALL sequence segments MUST:

1. MUST include a referential dependency that requires a specific prior segment AND a logical constraint. Standalone conjunctions (e.g., but, and, so) are NOT sufficient.

2. ITERATION & EVALUATION MARKER LOCK (CRITICAL - ABSOLUTE HARD LOCK - ZERO EXCEPTION):

🚨 MANDATORY AUTO-REWRITE STEP (NO EXCEPTION):
Before outputting ANY sequence question, you MUST scan EVERY non-first segment (A, B, C, and any sub-segment) and force-inject an ordinal/demonstrative anchor phrase at the VERY START of the segment. This is NOT optional. This is NOT conditional. You MUST physically rewrite the opening of each segment even if you believe it is already clear.

🔴 ABSOLUTE FORBIDDEN OPENERS (자동 거부 — 발견 즉시 리라이트):
- "My friend [verb]..." (X) → MUST become "Upon seeing this second drawing, my friend..."
- "He/She [verb]..." (X) → MUST become "After examining that second sketch, he/she..."
- "They [verb]..." (X) → MUST become "Seeing that third result, they..."
- Any segment starting with ONLY a bare subject + verb without a prior-reference phrase = INSTANT FAIL.
- Any segment where the first 5 words do NOT contain one of [this / that / these / those / second / third / fourth / after seeing / upon seeing / after examining / having seen / once ___ed] = INSTANT FAIL.

🔴 AMBIGUOUS ANCHOR BAN (복수 참조 가능성 완전 차단 — ZERO EXCEPTION):
The following anchor phrases are FORBIDDEN because they can refer to MULTIPLE prior segments:
- "the previous [noun]" (X) — ambiguous when 2+ prior events exist
- "the earlier [noun]" (X) — same ambiguity
- "the prior [noun]" (X) — same ambiguity
- "another [noun]" (X) — does not lock position
- "the first [noun]" when only 2 segments precede (ambiguous with implicit order)

REQUIRED REPLACEMENT — MUST use ORDINAL + DEMONSTRATIVE + OUTCOME-SPECIFIC STATE QUALIFIER that pins to EXACTLY ONE prior segment:
- "that specifically rejected second [concrete noun]" — pins to the 2nd occurrence AND its unique negative outcome
- "this explicitly dismissed third [concrete noun]" — pins to the 3rd occurrence AND its unique negative outcome
- "that very first [concrete noun]" — pins to the 1st occurrence only
⚠️ ORDINAL ALONE IS INSUFFICIENT: "second sketch" can theoretically refer to any prior item. You MUST add a OUTCOME-SPECIFIC STATE QUALIFIER that matches the UNIQUE OUTCOME of the referenced segment.

🔴 STATE QUALIFIER HIERARCHY (MANDATORY — 우선순위 순):
TIER 1 (STRONGLY PREFERRED — 결과 확정형): specifically rejected / explicitly dismissed / definitively failed / formally refused
TIER 2 (ACCEPTABLE — 명확한 상태 변화형): abandoned / discarded / overturned / withdrawn
TIER 3 (FORBIDDEN — 중립 동작형 ❌): requested / completed / attempted / created / freshly requested / newly completed
→ TIER 3 words describe ACTIONS that can apply to ANY segment, NOT unique outcomes. Using them does NOT resolve ambiguity.

MANDATORY CHECK: After writing the anchor, ask "Does this state qualifier describe a UNIQUE OUTCOME that happened to ONLY ONE specific segment?" If NO (e.g., "requested" — any segment could be "requested") → replace with a TIER 1 qualifier.

🔴 REQUIRED OPENER TEMPLATES (반드시 이 중 하나로 시작 — ORDINAL + TIER 1/2 STATE QUALIFIER 필수):
Template 1: "Upon seeing this [specifically rejected / explicitly dismissed] [second/third/fourth] [noun], [subject] [verb]..."
Template 2: "After examining that [specifically rejected / definitively failed] [second/third/fourth] [noun], [subject] [verb]..."
Template 3: "Having looked at that [formally refused / discarded] [second/third/fourth] [noun], [subject] [verb]..."
Template 4: "When [subject] saw this [abandoned / overturned] [second/third/fourth] [noun], [verb]..."
Template 5: "In response to the [explicitly dismissed / withdrawn] [second/third/fourth] [noun], [subject] [verb]..."
⚠️ "previous / earlier / prior" WITHOUT an explicit ordinal number is BANNED.

🔴 FICTIONAL-CONCRETE ANCHOR RULE:
The anchor phrase MUST reference a CONCRETE, COUNTABLE object/event that appears exactly ONCE in the prior segment. Vague references like "the situation" or "this" alone are FORBIDDEN. The noun after the ordinal/demonstrative MUST be specific (drawing / attempt / sketch / request / refusal / letter / answer / etc.).

🔴 THREE-STEP PRE-OUTPUT VERIFICATION (각 순서배열 문제마다 반드시 실행):
STEP A: List every non-first segment. For each, quote its first 10 words.
STEP B: Check — does the opening contain [ordinal/demonstrative + concrete noun referencing a unique prior event]? If NO → REWRITE the opening using one of the 5 templates above.
STEP C: Attempt ALL non-canonical permutations (e.g., if canonical is C-B-A, test B-C-A, A-B-C, B-A-C, A-C-B, C-A-B). For each permutation, ask: "Does the narrative still read coherently?" If ANY alternative permutation is coherent → FAIL → rewrite anchors with even more specific ordinal references (second / third / fourth).

🔴 CONCRETE EXAMPLE (이것이 올바른 형태):
WRONG: (B) My friend smiled gently and indulgently. "You see yourself..."
WRONG: (B) After examining that second sketch, my friend smiled... (❌ "second sketch" alone — theoretically ambiguous)
WRONG: (B) After examining that freshly requested second sketch, my friend smiled... (❌ "freshly requested" — TIER 3 neutral action, any segment could be "requested")
CORRECT: (B) After examining that specifically rejected second sketch, my friend smiled gently and indulgently. "You see yourself..."

The phrase "specifically rejected second sketch" is MANDATORY — "second" pins the ordinal position, and "specifically rejected" (TIER 1) pins to the UNIQUE NEGATIVE OUTCOME of segment C (which was rejected), making it impossible to confuse with any other segment. Neutral qualifiers like "freshly requested" FAIL because requesting is an action that applies to ALL segments.

3. MUST NOT be standalone descriptive sentences.
Generic emotional or descriptive sentences without explicit referential anchors are FORBIDDEN.

If a segment can be interpreted independently or placed in multiple positions without breaking grammar:
→ REGENERATE that segment immediately to include a specific anchor.

---

////////////////////////////////////////////////////////////
// 🔴 SEQUENCE UNIQUE RESOLUTION LOCK (최종 결정타)
////////////////////////////////////////////////////////////

CRITICAL: The sequence MUST be constructed so that ONLY ONE ordering allows ALL dependencies to resolve correctly.

1. Each segment MUST introduce a UNIQUE reference that is resolved by EXACTLY ONE other segment.
2. Cross-resolution MUST exist forcing a strict chain.
3. If ANY alternative ordering (e.g., C-B-A instead of B-A-C) resolves all references and produces a coherent narrative:
→ The question is INVALID and MUST be fully reconstructed.
4. Reverse-order plausibility MUST be tested.

---

////////////////////////////////////////////////////////////
// 🔴 INSERTION LOGIC VALIDATION & SINGLE-POINT LOCK (핵심 패치)
////////////////////////////////////////////////////////////

For sentence insertion questions:

1. EXPLICIT ANCHOR PHRASE MANDATORY:
The inserted sentence MUST contain a [Demonstrative + Specific Noun Phrase] that summarizes the exact condition of the PRECEDING sentence.
- FORBIDDEN: "And yet my little man seemed neither..." (Too generic, can fit multiple places).
- REQUIRED: "And yet, despite this extreme isolation, my little man seemed neither..."
- The anchor MUST tie to EXACTLY ONE unique event/situation in the text.

2. ZERO SEMANTIC DUPLICATION RULE:
The inserted sentence MUST NOT share the same meaning, narrative function, or descriptive result as the sentence IMMEDIATELY FOLLOWING IT.
- If the inserted sentence says "he showed no signs of distress" AND the next sentence says "Nothing about him gave any suggestion of exhaustion":
→ The question is INVALID due to semantic duplication.
- The inserted sentence MUST add a NEW logical bridge (e.g., cause, contrast) rather than just repeating the next sentence's point.

3. The sentence MUST FAIL in ALL other positions by creating a logical contradiction, breaking causal flow, or referencing a non-existent prior event.
4. If the sentence works in MORE THAN ONE position (e.g., position 1 and 2 both make sense):
→ REGENERATE the sentence to include a stronger, unique back-reference.

---

////////////////////////////////////////////////////////////
// 🔴 ANTI-MEMORIZATION LOCK (핵심 강화)
////////////////////////////////////////////////////////////

Questions MUST be solvable through logical reasoning ONLY.
If solving the question requires memorization of the original text -> INVALID.

---

////////////////////////////////////////////////////////////
// 🔴 DISTRACTOR GENERATION SYSTEM (강화)
////////////////////////////////////////////////////////////

You must construct ALL incorrect choices using CSAT-level distractor logic.
- 모든 오답은 정답과 의미 일부를 공유할 것 ("부분적으로 맞지만 핵심이 틀린 구조")
- 반드시 포함: cause/result 왜곡, general/specific 왜곡, 주체 변경, 키워드 일부만 반영
- 완전 무관한 오답, 단순 반대말, 지문 없는 정보 절대 금지.

---

// 🔴 DIFFICULTY ENFORCEMENT & HARD LOCKS

[순서 배열 강화]
- At least ONE option must match chronological order but be incorrect.
- The correct answer must violate simple time sequence and require causal/referential reasoning.

[문장 삽입 강화]
- The correct answer must depend on paragraph-level context, not just local clues.

---

// 🔴 FORMAT RULE (치명적 중요 🚨)

- Each choice must be on a NEW LINE
- Use ①②③④⑤ exactly once each
- No duplication, no broken numbering
- No inline choices allowed

---

////////////////////////////////////////////////////////////
// 🔴 SUMMARY QUESTION HARD LOCK & OPTION DISTRIBUTION
////////////////////////////////////////////////////////////

Summary question MUST follow:
① A — B
② A — B
... Only ONE set allowed. Forbidden: single-word options.

Each blank (A), (B) MUST have balanced distribution across options.
- No option should be identifiable through frequency alone.
- Do NOT allow one option in (A) to appear significantly more frequently.
- The correct answer MUST include the most conceptually central keyword of the passage.

---

// 🔴 TITLE & MAIN IDEA QUESTION HARD LOCK

- Title: MUST be the MOST comprehensive and abstract option. Wrong choices MUST include specific details.
- Main Idea: MUST be strictly more comprehensive than ALL other options. Wrong choices MUST omit context, outcome, or core mechanism.

---

////////////////////////////////////////////////////////////
// 🔴 VOCABULARY QUESTION HARD LOCK (어휘 밸런스 완벽 고정)
////////////////////////////////////////////////////////////

Vocabulary question MUST contain exactly ONE contextually incorrect word.
The incorrect word MUST create a clear logical contradiction, BUT it MUST remain superficially plausible.

CRITICAL: DISTRACTOR HOMOGENEITY RULE (No "Odd-One-Out")
1. Part of Speech & Form Lock: The incorrect choice MUST naturally fit the grammar of the sentence. Do NOT mix completely different word classes that stick out.
2. Tone/Sentiment Camouflage: You MUST NOT create a situation where 4 words share a similar tone (e.g., negative/descriptive states like 'isolated', 'exhausted', 'cumbersome') and 1 word completely breaks the pattern (e.g., an active positive verb like 'approve').
- The replacement MUST blend perfectly into the list. (e.g., If others are descriptive adjectives, instead of "approve", use "accept", "acknowledge", or match the adjective form).
3. The "Two-Plausible" Rule: At least TWO options MUST appear contextually plausible but require deep sentence/paragraph evaluation to determine correctness. The answer MUST NOT be instantly recognizable by glancing at the 5 words alone.

4. 🔴 GLANCE-TEST LOCK (어휘 튐 방지 - 절대 규칙):
   Before finalizing a vocabulary question, apply the "5-second glance test": If the incorrect word is identifiable as the odd-one-out WITHOUT reading the passage — using only the 5 words side-by-side — the question is INVALID.
   - Check semantic field overlap: all 5 words MUST belong to an overlapping/adjacent semantic field (e.g., all can describe physical/mental states, or all can describe a manner of action).
   - FORBIDDEN EXAMPLE: [isolated / extraordinary / uncertainly / overpowering / sustained] — "sustained" is the only word that describes continuation/maintenance while the others describe intensity/rarity/state → TOO OBVIOUS.
   - FORBIDDEN EXAMPLE: [natural / fitting / vivid / coherent / reinforced] — "reinforced" is the only past-participle action verb while the others are descriptive adjectives → TOO OBVIOUS.
   - FORBIDDEN EXAMPLE: [isolated / exhausted / cumbersome / overpowering / fortified] — "fortified" implies active strengthening while the others describe burdensome/depleting states → TOO OBVIOUS.
   - FIX: replace outliers with words matching the adjective/state semantic field of the other 4 (e.g., "sustained", "maintained", "pronounced", "heightened", "intensified", "polished").
   - MANDATORY SELF-CHECK: List all 5 words. Ask "Do all 5 share at least one semantic/functional dimension?" If no → regenerate the incorrect choice.
   - MANDATORY SELF-CHECK: Ask "Would a student who has NOT read the passage pick my intended answer just by pattern-matching the 5 words?" If yes → regenerate.
   - MANDATORY SELF-CHECK: Ask "Does my incorrect choice imply ACTIVE STRENGTHENING/REINFORCING while the other 4 describe states or conditions?" If yes → replace with a word describing a state (e.g., "sustained", "maintained", "prolonged").

5. 🔴 TWO-PLAUSIBLE ENFORCEMENT (변별력 강제 — CRITICAL):
   The question MUST have AT LEAST 2 choices that appear contextually plausible when read with the passage. Guessing without careful reading MUST NOT yield the correct answer.
   - MANDATORY SELF-CHECK: After writing the 5 choices, identify the 2nd-most-plausible distractor. If you CANNOT name a strong runner-up → the question is INVALID, regenerate the incorrect word to be more camouflaged.
   - The correct (incorrect-in-context) word MUST require at least 2 sentences of context to eliminate. Single-sentence-level contradictions are INSUFFICIENT.
   - If 4 options are "obviously fine" and 1 is "obviously wrong" → INVALID. Rewrite so the wrong word is subtly contradictory, not blatantly opposite.

The following words are FORBIDDEN as incorrect choices:
- cursorily, casually, loosely, somewhat, relatively, reinforced, fortified, prolonged

---

// 🔴 SHORT-ANSWER & DESCRIPTIVE WORD COUNT LOCK

For any short-answer/descriptive question:
1. Extract the answer FIRST from the passage.
2. Count words EXACTLY using space-separated tokens (after removing punctuation).
3. THEN generate the question condition based on the actual count.
4. The extracted answer MUST match the original passage EXACTLY (preserve punctuation, capitalization, spacing).
5. Mismatch = automatic regeneration.

🔴 BOUNDARY INTEGRITY LOCK (CRITICAL - 경계 오류 방지):
6. The extracted answer MUST begin and end at a NATURAL syntactic boundary. FORBIDDEN to cut mid-phrase.
   - FORBIDDEN: extracting "fatigue or hunger or thirst or fear" when the passage reads "fainting from fatigue or hunger or thirst or fear" (cuts off the governing preposition "from").
   - REQUIRED: include the leading preposition/conjunction/determiner that governs the extracted phrase, OR start the extraction at a clause boundary.
7. UNIQUENESS CHECK: The extracted span MUST be the ONLY contiguous span in the passage that satisfies the stated word count AND the semantic condition of the question. If another span of the same length could also answer, REGENERATE with a tighter condition or different span.
8. Before finalizing, re-read the passage and confirm: "Could a student reasonably extract a DIFFERENT span of the same word count that also fits the question?" If yes → INVALID, regenerate.

---

// 🔴 PRONOUN QUESTION HARD LOCK

Options MUST be exactly:
① (1) / ② (2) / ③ (3) / ④ (4) / ⑤ (5)

- 보기의 모든 대명사 유형을 통일할 것 (예: him / him / him / him / him)
- 의미 기반으로만 구별 가능하게 설계할 것.

---

// 🔴 AUTO VALIDATION SYSTEM (문제 자동 검수 — 필수 실행)

After generating ALL questions, you MUST run a validation check.
1. 정답이 단 하나인지 확인할 것
2. 다른 선택지가 정답처럼 보이지 않는지 확인할 것 (특히 순서배열, 문장삽입)
3. 지문 근거가 명확한지 확인할 것
4. 오답이 논리적 Distractor인지 확인할 것

If ANY rule fails (especially sequence unique ordering or insertion unique placement):
→ 1. Identify the flawed question
→ 2. Modify ONLY that question (DO NOT regenerate the entire exam)
→ 3. Re-run validation until ALL checks pass.

---

// 🔴 FINAL SAFETY CHECK & OUTPUT FORMAT

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

... (모든 문항 동일)

---

[해설지]

1번 정답:
- 근거:
- 오답 해설:

... (모든 문항 동일)

---

////////////////////////////////////////////////////////////
// 🔴 GOOGLE DOCS EXECUTION HARD LOCK
////////////////////////////////////////////////////////////

You MUST output TWO clearly separated sections in ONE response:
1. [시험지]
2. [해설지]

Google Docs에 바로 복붙 가능한 형태로 출력할 것.
- 선택지는 반드시 줄바꿈으로 출력할 것
- 각 선택지는 ①②③④⑤ 번호만 사용할 것
- 문제 간 한 줄 공백 유지
- 서술형 조건 반드시 그대로 출력: "15~20단어 사이로 작성할 것 (필요시 단어 추가 및 형태 변화 가능)"

---

// 🔴 PASSAGE

${passage}

---

🚨 [최종 도구 실행 명령]

위 규칙을 모두 적용하여
하나의 응답 내에서 [시험지]와 [해설지] 두 섹션으로
Google Docs에 바로 복붙 가능한 형태로 출력하라.`;
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

// ── 번역 워크시트 프롬프트 템플릿 ────────────────────────────────────────────

/**
 * 지문에서 "Reading Rest Stop" 섹션을 JS에서 미리 제거하고
 * 순수 본문 묶음 배열만 반환한다.
 *
 * 구조: [chunk1] + [RRS group] + [chunk2] + [RRS group] + ...
 * "Reading Rest Stop" 이 묶음 경계 역할을 함.
 * 각 RRS group 마지막 블록(🧠Comprehension Question)은
 * "✅Answer:" 이후에 다음 chunk 텍스트가 이어질 수 있으므로 추출.
 */
export function extractPassageChunks(passage: string): string[] {
  const parts = passage.split(/\nReading Rest Stop/g);
  const chunks: string[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // 첫 번째 비어있지 않은 줄로 RSS 섹션 여부 판단
    const firstLine = trimmed.split('\n').find((l) => l.trim() !== '') ?? '';
    const isRSSContent =
      /[🔑🧱🧠✅👉➡]/.test(firstLine) ||
      /^Q:/.test(firstLine.trim()) ||
      /^Key Expressions/i.test(firstLine.trim()) ||
      /^Grammar Structures/i.test(firstLine.trim()) ||
      /^Comprehension Question/i.test(firstLine.trim());

    if (isRSSContent) {
      // ✅Answer: 이후 빈 줄 다음에 본문이 이어지는 경우 추출
      const answerMarker = part.includes('✅Answer:') ? '✅Answer:' : '✅ Answer:';
      const answerIdx = part.indexOf(answerMarker);
      if (answerIdx !== -1) {
        const afterAnswer = part.slice(answerIdx + answerMarker.length);
        const gapIdx = afterAnswer.indexOf('\n\n');
        if (gapIdx !== -1) {
          const remaining = afterAnswer.slice(gapIdx).trim();
          if (remaining) chunks.push(remaining);
        }
      }
    } else {
      chunks.push(trimmed);
    }
  }

  return chunks.filter((c) => c.trim() !== '');
}

function buildTranslationTemplate(passage: string): string {
  const chunks = extractPassageChunks(passage);

  // JS에서 RSS 섹션 제거 후 순수 본문만 번호 붙여 전달
  const numberedPassage = chunks
    .map((chunk, i) => `[${i + 1}묶음]\n${chunk}`)
    .join('\n\n---\n\n');

  // 원본 섹션 미리 조립 (Claude가 그대로 출력할 수 있도록)
  const originalSection = chunks
    .map((chunk) => chunk)
    .join('\n----------------------------\n');

  return `[작업]
아래 영어 지문을 한국어로 해석하라.

[중요]
출력은 평문만 사용한다.
출력의 각 줄은 일반 텍스트 문장으로만 작성한다.
제목, 소제목, 강조, 목록, 인용, 코드 형식은 사용하지 않는다.
입력 지문의 줄바꿈이나 문단 위치를 제목 구조로 해석하지 않는다.
모든 줄은 동일한 수준의 일반 텍스트로만 출력한다.

[출력 형식]
아래 형식을 묶음마다 그대로 반복한다.

## 1번

원본
영어 원문

----------------------------
해석
한국어 해석


## 2번

원본
영어 원문

----------------------------
해석
한국어 해석

[형식 고정 규칙]
각 묶음의 첫 줄은 반드시 ## N번 (## 1번, ## 2번, ## 3번 ...) 형식이다.
## N번 다음에는 빈 줄을 하나 둔다.
그 다음 줄은 반드시 원본이다.
원본 다음 줄부터는 해당 묶음의 영어 원문 전체를 그대로 출력한다.
영어 원문이 끝나면 반드시 빈 줄을 하나 추가한 뒤 다음 줄에 ---------------------------- 를 출력한다.
그 다음 줄은 반드시 해석이다.
해석 다음 줄부터는 해당 영어 원문의 한국어 해석 전체를 출력한다.
묶음과 묶음 사이는 빈 줄 두 개로 구분한다.
원본과 해석이라는 단어는 수정하지 않는다.
원본과 해석 앞뒤에 다른 문자를 추가하지 않는다.
출력 전체에서 모든 줄은 일반 텍스트 문장이어야 한다.

[출력 금지 형식]
제목처럼 보이는 줄로 바꾸지 않는다.
문단 첫 문장을 따로 분리하지 않는다.
강조 표현을 넣지 않는다.
구조를 재편집하지 않는다.

지문:
${numberedPassage}

원본 텍스트:
${originalSection}

[출력 전 점검]
출력이 지정된 형식과 정확히 일치하는지 확인한 뒤에만 답한다.`;
}

// ── 해설 및 정리 노트 프롬프트 템플릿 ────────────────────────────────────────

function buildStudyNoteTemplate(passage: string): string {
  return `당신은 대한민국 최고의 영어 1타 강사입니다.
아래 영어 지문을 바탕으로 **강사가 수업 중 사용하는 "수업 설계서"**를 작성하세요.
이것은 학생 자습용 해설이 아닙니다. 강사가 수업에서 학생에게 질문을 던지고,
오답 유도 포인트를 짚어주며, 판단 공식을 문답형으로 끌어내는 **수업 지도**입니다.
따라서 정답을 바로 써주지 말고, **질문형 구조**로 학생이 스스로 끌려오게 만드세요.
마크다운 형식을 적극 활용하여 수업 흐름이 한눈에 보이게 구성하세요.

🚨 [출력 형식 절대 규칙]
- 모든 섹션은 반드시 번호 순서대로 작성한다.
- 요약 / 문단별 해설 / 근거 문장 / 어휘 / 문법 / 출제 전략 / 이해 확인 문제 중 하나라도 생략하면 안 된다.
- 각 설명은 학생이 혼자 복습 가능한 수준으로 구체적으로 작성한다.
- "중요하다", "핵심이다"만 쓰는 추상적 설명 금지 — 반드시 "왜 그런지"까지 설명한다.
- 정답 설명 시 반드시 오답 제거 기준도 함께 제시한다.

🚨 [수능형 독해 강화 규칙]
- 각 문단 해설에서 반드시 아래 3가지를 포함한다:
  ① 글의 흐름 (원인 → 결과 / 상황 → 반응)
  ② 화자의 의도 또는 심리
  ③ 다음 문장과의 연결 논리
- "왜 이 문장이 나왔는지"를 반드시 설명한다.
- 출제자가 만든 함정(의도 vs 결과, 일부 사실 vs 핵심 등)을 명시한다.

🚨 [만점 안정화 규칙 — 시험장 적용형]
- 모든 유형 해설에서 반드시 "선지형 판단 과정"을 ①②③④⑤ 형태로 시뮬레이션한다.
  단순히 "A는 틀리다"가 아니라, 학생이 시험장에서 각 선지를 어떻게 소거하는지
  예) ① delighted ❌ (기쁨 X → 놀람) / ② relieved ❌ (안도 X) / ③ astonished ✔
- "킬러 포인트" 섹션을 반드시 포함한다. 변별력의 핵심 두 축을 명시한다.
  ① 의도 vs 결과 (화자의 의도와 실제 결과가 다른 지점)
  ② 보이는 것 vs 본질 (visible vs invisible / appearance vs essence)
- 문제 유형은 심경/빈칸/주제뿐 아니라 반드시 순서·삽입·지칭 유형도 함께 다룬다.
- 이해 확인 문제는 "사실 확인"과 "추론/의미"를 분리해서 출제한다.

🚨 [실수 0% 만점 고정 규칙 — 최종 단계]
- **초고속 선지 제거 기준** 필수: 각 유형 해설에 "읽자마자 5초 내 제거" 규칙을 ★ 마커로 제시한다.
  예) ★ delighted → 감정 방향 다름 → 즉시 제거
      ★ relieved → 상황 미스매치 → 즉시 제거
      ★ indifferent → 태도 불일치 → 즉시 제거
- **트리거 → 정답 직결 구조** 필수: 트리거 표는 단순히 "문제 유형 예측"에 멈추지 않고,
  "이 문장 나오면 → 전반부 감정 = X / 후반부 감정 = Y → 선지 바로 매칭" 형태로 정답까지 연결한다.
- **킬러 포인트 = 선지 판단 규칙화**: 킬러 포인트는 설명이 아니라 "판단 공식"이어야 한다.
  예) 선지에 "educational purpose" 등장 → 의도 vs 결과 오류 → 100% 오답
      선지에 "외형 묘사만" 담긴 것 → 보이는 것 vs 본질 위반 → 100% 오답
  각 킬러마다 "이 단어/표현 나오면 무조건 오답" 규칙을 최소 2개씩 명시한다.
- **지칭 문제 함정 분석**: 지칭 유형은 단순 "누구를 지칭하는가"가 아니라,
  "왜 학생이 헷갈리는지"까지 반드시 분석한다.
  예) apparition → 사람을 가리키는데 사물처럼 보여 혼동 유발 (함정)
      judge → 역할/직업 표현이라 실제 인물과 분리되어 보임 (함정)

🚨 [생각 안 해도 맞는 해설 규칙 — 속도·자동화 최종 패치]
- **한 줄 판단 공식** 필수: 각 유형마다 "이 두 개(단어/개념) 아니면 다 오답" 형태의
  초압축 공식을 한 줄로 박아둔다. 학생이 읽자마자 반사적으로 판단하게 만드는 목적.
  예) 심경: 초반 생존 위기 → desperate / 아이 등장 → astonished → 이 두 단어 아니면 다 오답
- **오답 패턴 묶음 (재사용 가능 암기표)** 필수: 특정 지문에만 해당하는 오답이 아니라,
  다른 지문에도 적용되는 **반복 출제 오답 패턴**을 묶음으로 정리한다.
  예) delighted → '기쁨' → 극한 상황에서는 거의 항상 오답
      relieved → '안도' → 상황 반전 없으면 오답
      indifferent → '무관심' → 감정 강도 지문에서는 오답
- **풀이 순서 자동화 (1→2→3→4 플로우)** 필수: 각 유형마다 학생이 시험장에서
  따라갈 수 있는 4단계 고정 플로우를 명시한다. 해설이 아니라 실행 절차여야 한다.
  예) ① 트리거 문장 찾기 → ② 감정/핵심 키워드 확정 → ③ 선지에서 3개 즉시 제거
      → ④ 남은 2개 비교 후 정답 선택

🚨 [강사용 전환 규칙 — 수업 설계서 모드]
이 해설은 "학생 자습용"이 아니라 **"강사가 수업할 때 쓰는 설계서"**다. 반드시 아래 3가지를 적용한다.
- **① 정답 숨기기 (질문형 변환)**: 정답을 바로 쓰지 말고, 학생에게 던지는 질문 형태로 변환한다.
  ❌ 금지: "정답은 astonished이다. 왜냐하면 ~"
  ✅ 필수: "❓ 왜 astonished가 정답일까? / ❓ delighted는 왜 틀릴까? / ❓ 여기서 학생이 찍을 오답은?"
- **② 오답 유도 포인트 표시 (⚠️ 학생 낚이는 지점)**: 각 유형·선지에 "여기서 학생 몇 %가 낚이는지"를
  ⚠️ 마커로 명시한다. 강사가 수업에서 "여기!" 하고 짚어줄 수 있게.
  예) "⚠️ 여기서 90% 학생이 delighted 찍는다 — 상황 반전을 놓쳐서"
      "⚠️ 이 문장 나오면 70% 학생이 순서를 B-A-C로 꼬인다"
- **③ 판단 공식 → 소크라테스 문답형**: 판단 공식도 단방향 설명이 아니라,
  강사가 학생에게 단계별 질문을 던지며 끌어내는 **문답 체인**으로 작성한다.
  예) ❓ 초반 상황 뭐야? → (생존 위기)
      ❓ 그럼 감정 뭐야? → (desperate)
      ❓ 아이 등장 → 정상 상황이냐? → (아님)
      ❓ 그럼 감정 뭐야? → (astonished)
  → 이런 문답 체인으로 학생이 스스로 답에 도달하게 유도한다.

---

## 📖 지문 전체 해설 및 학습 정리

### 1. 지문 핵심 요약
한 문단(3~5줄)으로 지문의 핵심 내용을 간결하게 요약한다.

### 2. 문단별 상세 해설
각 문단(또는 묶음)마다 아래 형식으로 정리한다.

#### 문단 1
- **핵심 내용**: 이 문단에서 말하는 바를 한 줄로 정리
- **글의 흐름**: 원인→결과 / 상황→반응 구조로 설명
- **화자의 의도/심리**: 이 문단에서 화자(또는 등장인물)가 느끼는 감정이나 의도
- **다음 문단과의 연결**: 이 문단이 다음 내용과 어떻게 이어지는지
- **출제자의 함정**: 이 문단에서 학생이 착각하기 쉬운 포인트와 실제 정답 논리

#### 문단 2
(동일 형식 반복)

### 3. 시험용 근거 문장 추출 (트리거 → 정답 직결 방식)
지문에서 수능 문제의 근거가 되는 핵심 문장을 추출하고,
"이 문장이 나오면 X 문제 출제 100% + 정답 선지까지 직결" 형태로 정리한다.

| 근거 문장 (원문) | 트리거 — 출제 가능 문제 | 정답 직결 매칭 |
|---|---|---|
| "(지문 원문 문장)" | "이 문장 나오면 = 심경 문제 100% 출제" | 전반부 감정 = desperate / 후반부 감정 = astonished → 선지 바로 매칭 |
| "(지문 원문 문장)" | "이 문장 나오면 = 빈칸 문제 100% 출제" | 빈칸 핵심 키 = invisible / appearance 계열 → 해당 개념 선지 즉시 선택 |

⚠️ 반드시 "트리거 → 정답 방향" 구조를 한 줄 안에 녹일 것.
트리거만 있고 선지 매칭 방향이 없으면 탈락 (설명이 아니라 실전형 지시여야 함).

### 4. 핵심 어휘 & 표현 정리
| 어휘 / 표현 | 뜻 | 지문 속 의미 | 수능 출제 포인트 |
|---|---|---|---|
| (단어/표현) | (한국어 기본 뜻) | (이 지문에서 실제로 쓰인 의미/뉘앙스) | (수능에서 어떻게 출제되는지, 주의할 점) |

### 5. 문법 핵심 포인트
각 문법 포인트마다 아래 형식으로 정리한다.

**포인트 1: (문법 이름)**
- 설명: (문법 규칙을 쉽게 설명)
- 왜 이 문법이 쓰였는가: (이 문맥에서 해당 문법이 선택된 이유)
- 지문 예시: "(지문에서 해당 문법이 쓰인 문장)"
- 해석: (해당 문장 해석)
- 오답 주의: (학생들이 자주 헷갈리는 다른 형태와 왜 틀리는지)

### 6. 문제 유형별 출제 전략
반드시 아래 유형을 **모두** 다룬다 (지문에서 해당 유형이 나올 수 있다면 반드시 포함):
심경 / 빈칸 / 주제·요지 / 순서 / 삽입 / 지칭 (+ 그 외 해당 유형)

각 유형마다 아래 형식으로 정리한다.

#### 유형: (심경 / 빈칸 / 순서 / 삽입 / 지칭 / 주제·요지 중 해당 유형)
- **💡 한 줄 판단 공식** (반사 판단용 — 반드시 1줄로 박을 것):
  예) "초반 생존 위기 → desperate / 아이 등장 → astonished → 이 두 단어 아니면 다 오답"
- **🎓 수업용 소크라테스 문답 체인** (강사가 학생에게 단계별 질문을 던지는 방식 — 정답을 직접 쓰지 말 것):
  ❓ (1단계 질문: 상황 파악) → (괄호 안 예상 답)
  ❓ (2단계 질문: 감정/핵심 키워드) → (예상 답)
  ❓ (3단계 질문: 전환점 / 반전 존재?) → (예상 답)
  ❓ (4단계 질문: 그럼 정답 방향은?) → (예상 답)
- **🚀 풀이 순서 (1→2→3→4 자동화 플로우)**:
  ① 트리거 문장 찾기 → ② 감정/핵심 키워드 확정 → ③ 선지 3개 즉시 제거 → ④ 남은 2개 비교 후 정답
- **❓ 수업용 핵심 질문** (정답 숨기기 — 반드시 질문형으로만 작성):
  - ❓ 왜 (정답 단어)가 정답일까?
  - ❓ (매력적 오답 단어)는 왜 틀릴까?
  - ❓ 학생이 이 문제에서 가장 많이 찍는 오답은 무엇이고, 왜 그렇게 찍는가?
- **⚠️ 오답 유도 포인트 (학생 낚이는 지점 — 수업 중 "여기!" 하고 짚을 위치)**:
  - ⚠️ 여기서 90% 학생이 (선지 단어) 찍는다 — (왜 낚이는지 이유)
  - ⚠️ 여기서 70% 학생이 (선지 단어) 고민한다 — (왜 흔들리는지 이유)
- **⚡ 초고속 선지 제거 (5초 컷)**: 읽자마자 버리는 선지를 ★ 마커로 정리
  - ★ (선지 단어) → (한눈에 틀리는 이유 — 예: 감정 방향 다름 / 상황 미스매치 / 태도 불일치) → 즉시 제거
  - ★ (선지 단어) → (즉시 제거 이유) → 즉시 제거
  - ★ (선지 단어) → (즉시 제거 이유) → 즉시 제거
- **선지형 판단 시뮬레이션** (반드시 객관식 형태로 작성 — 단, "왜?"까지 질문으로 남길 것):
  ① (선지 예시) ❌ → ❓ 왜 틀릴까? → (학생이 스스로 답하게 유도하는 힌트)
  ② (선지 예시) ❌ → ❓ 왜 틀릴까? → (힌트)
  ③ (선지 예시) ✔ → ❓ 왜 맞을까? → (정답 근거 단서를 질문 형태로)
  ④ (선지 예시) ❌ → ❓ 왜 틀릴까? → (힌트)
  ⑤ (선지 예시) ❌ → ❓ 왜 틀릴까? → (힌트)
- **오답 제거 기준**: 학생이 시험장에서 ①→⑤ 순으로 소거하는 사고 흐름을 단계별로 기술
- **출제자의 함정**: (학생이 낚이기 쉬운 부분과 함정 무력화 방법)
- **학생 사고 오류**: (학생이 흔히 착각하는 논리와 실제 정답 논리)

#### 유형: 지칭 (반드시 포함 — 함정 분석 강화 필수)
- **정답 근거**: (밑줄 대상이 누구/무엇을 가리키는지 + 지문 근거)
- **⚠️ 왜 헷갈리는가 (함정 분석)**: 단어마다 학생이 왜 오답을 고르는지 구체적으로 짚는다.
  - (단어 예: apparition) → 사람을 가리키는데 "유령/환영"처럼 사물형 명사로 들려 혼동
  - (단어 예: judge) → 역할/직업 표현이라 실제 화자와 다른 인물로 착각
  - (단어 예: little chap / my friend / this young one 등) → 표현이 다양해 동일 인물 인식 실패
- **선지형 판단 시뮬레이션**: ①~⑤ 각 밑줄이 가리키는 대상을 객관식 형태로 정리
- **출제자의 함정**: 같은 인물을 다른 명사로 반복 지칭하여 학생이 "다른 사람"으로 오인하게 유도하는 패턴

#### 유형: (추가 유형이 있다면 반복)

### 7. 반복 출제 오답 패턴 묶음 (재사용 가능 암기표)
이 지문에만 쓰는 오답이 아니라, **다른 지문에도 그대로 적용 가능한 반복 출제 오답 패턴**을 묶음으로 정리한다.
학생이 이 표 하나만 외우면 다른 지문의 심경/빈칸 문제에서도 즉시 소거 가능하게 만들 것.

#### 🚨 심경 문제 오답 패턴 (반복 출제)
| 선지 단어 | 의미 | 오답이 되는 조건 |
|---|---|---|
| delighted | 기쁨 | 극한 상황·위기·고립 지문에서는 거의 항상 오답 |
| relieved | 안도 | 상황 반전·해결 장면이 없으면 오답 |
| indifferent | 무관심 | 감정 강도가 묘사된 지문에서는 오답 |
| amused | 재미있어함 | 진지한 상황·긴장된 장면에서는 오답 |
| confident | 자신감 | 불확실·혼란 상황에서는 오답 |

#### 🚨 빈칸·주제 문제 오답 패턴 (반복 출제)
| 선지 표현 유형 | 오답이 되는 조건 |
|---|---|
| "교육적 의도 (educational / didactic)" | 우연한 결과를 다루는 지문에서는 오답 |
| "외형 묘사 (appearance / shape / size)" | 본질/내면을 다루는 지문에서는 오답 |
| "단순 대조 (simple contrast)" | 인과·전환이 핵심인 지문에서는 오답 |

⚠️ 이 섹션은 해당 지문에 실제 출제 가능성이 있는 오답 패턴을 추려서 작성하되,
반드시 "재사용 가능한 규칙" 형태로 유지한다 (지문 고유 세부사항 금지).

### 8. 킬러 포인트 (변별력 핵심 — 판단 규칙화)
킬러는 "설명"이 아니라 **선지 판단 공식**이다. 반드시 "이 단어/표현이 선지에 나오면 → 무조건 오답" 규칙을 최소 2개 이상 명시한다.

**🔥 킬러 ①: 의도 vs 결과**
- 화자/등장인물의 **의도**: (무엇을 하려고 했는가 — 지문 근거)
- 실제 **결과**: (어떤 결과가 벌어졌는가 — 지문 근거)
- 📏 **판단 규칙 (이 단어 나오면 무조건 오답)**:
  - ❌ 선지에 "educational purpose / intentional lesson / didactic" 류 등장 → 의도 vs 결과 왜곡 → 100% 오답
  - ❌ 선지에 "planned outcome / deliberate guidance" 류 등장 → 의도 vs 결과 혼동 → 100% 오답

**🔥 킬러 ②: 보이는 것 vs 본질 (visible vs invisible / appearance vs essence)**
- 겉으로 **보이는 것**: (표면적 현상 / 외형 — 지문 근거)
- 실제 **본질**: (내면 / 진짜 의미 — 지문 근거)
- 📏 **판단 규칙 (이 단어 나오면 무조건 오답)**:
  - ❌ 선지에 "외형 묘사만 담긴 표현 (shape / size / physical appearance)" 등장 → 본질 누락 → 100% 오답
  - ❌ 선지에 "visible / observable / apparent"만 강조된 표현 등장 → essence 대립 위반 → 100% 오답

### 9. 수업용 질문 세트 (강사가 학생에게 던지는 질문)
이 섹션은 "이해 확인 문제"가 아니라 **강사가 수업 중 학생에게 던지는 질문 리스트**다.
정답은  **예상 답변:** 형태로 접혀 있고, 강사가 먼저 학생에게 질문을 던진 뒤 사용한다.

**❓ Q1. (사실 확인형)** — 지문에서 직접 답을 찾게 만드는 질문
> **예상 답변:** (정답 및 지문 근거 문장 인용)
> ⚠️ **학생 오답 유도 포인트:** 여기서 학생 __% 정도가 __로 답한다 — (왜 틀리는지)

**❓ Q2-1. (사실 확인형)** — 예: "화자는 왜 거절했는가? / 무슨 일이 벌어졌는가?"
> **예상 답변:** (지문에서 직접 인용 가능한 사실)
> ⚠️ **학생 오답 유도 포인트:** (학생이 사실을 오해하는 지점)

**❓ Q2-2. (추론/의미형)** — 예: "이것이 의미하는 바는? / 화자의 진짜 의도는?"
> **예상 답변:** (지문 근거를 기반으로 한 추론 — 근거 문장 반드시 명시)
> ⚠️ **학생 오답 유도 포인트:** (학생이 표면만 보고 추론을 틀리는 이유 — 몇 %가 어디에서 낚이는지)

---

지문:
${passage}`;
}

// ── 번역 워크시트 생성 파라미터 ──────────────────────────────────────────────

export interface GenerateTranslationParams {
  passageText?: string;
  externalKey?: string;
  externalRegistry?: ExternalRegistry;
}

export interface GenerateTranslationResult {
  translationPrompt: string | null;
  studyNotePrompt: string | null;
  error: string | null;
}

/**
 * 외부 지문을 받아 해석 프롬프트와 해설 정리 프롬프트를 각각 생성한다.
 */
export function generateTranslationPrompt(params: GenerateTranslationParams): GenerateTranslationResult {
  const {
    passageText = '',
    externalKey = '',
    externalRegistry = {},
  } = params;

  let passage = passageText.trim();
  if (!passage && externalKey) {
    passage = getExternalPassageText(externalKey, externalRegistry);
  }
  if (!passage) {
    return { translationPrompt: null, studyNotePrompt: null, error: '지문을 선택하거나 직접 입력해주세요!' };
  }

  // Reading Rest Stop 섹션 제거 후 순수 본문만 추출 (두 템플릿 모두 동일하게 적용)
  const chunks = extractPassageChunks(passage);
  const cleanPassage = chunks.join('\n\n');

  const translationPrompt = buildTranslationTemplate(passage);
  const studyNotePrompt = buildStudyNoteTemplate(cleanPassage);
  return { translationPrompt, studyNotePrompt, error: null };
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
