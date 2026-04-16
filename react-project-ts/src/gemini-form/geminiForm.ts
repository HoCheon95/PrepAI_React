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
function extractPassageChunks(passage: string): string[] {
  const parts = passage.split(/\nReading Rest Stop/g);
  const chunks: string[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // 첫 번째 비어있지 않은 줄로 RSS 섹션 여부 판단
    const firstLine = trimmed.split('\n').find((l) => l.trim() !== '') ?? '';
    const isRSSContent =
      /[🔑🧱🧠✅👉➡]/.test(firstLine) || /^Q:/.test(firstLine.trim());

    if (isRSSContent) {
      // ✅Answer: 이후 빈 줄 다음에 본문이 이어지는 경우 추출
      const answerIdx = part.indexOf('✅Answer:');
      if (answerIdx !== -1) {
        const afterAnswer = part.slice(answerIdx + '✅Answer:'.length);
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

// ── 번역 워크시트 생성 파라미터 ──────────────────────────────────────────────

export interface GenerateTranslationParams {
  passageText?: string;
  externalKey?: string;
  externalRegistry?: ExternalRegistry;
}

/**
 * 외부 지문을 받아 "외부지문 해석 해줘 + 지문" 프롬프트를 생성한다.
 */
export function generateTranslationPrompt(params: GenerateTranslationParams): GenerateResult {
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
    return { prompt: null, error: '지문을 선택하거나 직접 입력해주세요!' };
  }

  const prompt = buildTranslationTemplate(passage);
  return { prompt, error: null };
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
