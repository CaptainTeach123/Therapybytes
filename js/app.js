(() => {
'use strict';

/* =====================================================================
 * State
 * ===================================================================== */
const KEY = 'therapybytes.v1';
const STEPS = [
  { id: 'session', label: 'Session' },
  { id: 'dx',      label: 'Diagnosis' },
  { id: 'subj',    label: 'Client report' },
  { id: 'obs',     label: 'Observations' },
  { id: 'risk',    label: 'Risk' },
  { id: 'int',     label: 'Interventions' },
  { id: 'prog',    label: 'Progress & need' },
  { id: 'plan',    label: 'Plan' },
];
const SYMPTOM_STATUS = [
  ['', '— not addressed —'],
  ['present', 'Present'],
  ['worsened', 'Worsened'],
  ['improved', 'Improved'],
  ['absent', 'Not present'],
];
const FREQUENCIES = ['', 'Weekly', 'Every other week', 'Twice weekly', 'Monthly', 'As needed', 'Per treatment plan'];
const RECOMMENDATIONS = [
  ['', '— select —'],
  ['continue', 'Continue current frequency'],
  ['increase', 'Increase frequency / intensity'],
  ['step_down', 'Step down frequency'],
  ['discharge', 'Approaching discharge / termination'],
  ['higher', 'Refer to higher level of care'],
];
const MODALITIES = ['In person', 'Telehealth (video)', 'Telehealth (audio only)'];
const PARTICIPANTS = ['Client only', 'Client and parent/guardian', 'Couple', 'Family', 'Group', 'Collateral only'];

const today = () => {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

function blank() {
  return {
    format: 'soap',
    session: { date: today(), start: '', end: '', cpt: '90834', modality: MODALITIES[0], participants: PARTICIPANTS[0], clientId: '', sessionNum: '', practitioner: '' },
    dx: [],
    subj: { since: '', quote: '', events: '', focus: '', report: '' },
    mse: { mood: '' },
    obsNotes: '',
    measures: [],
    risk: { si: '', siDetail: '', hi: '', sh: '', abuse: '', protective: [], level: '', actions: [], notes: '' },
    int: {},
    intOther: '',
    response: '',
    goals: [],
    impression: '',
    func: { domains: [], statement: '', rec: '' },
    plan: { next: '', freq: '', focus: '', homework: '', coord: '', change: '' },
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    const b = blank();
    const s = saved.S || {};
    for (const k of Object.keys(b)) {
      if (s[k] === undefined) continue;
      b[k] = (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) ? Object.assign(b[k], s[k]) : s[k];
    }
    return { S: b, step: STEPS.some(x => x.id === saved.step) ? saved.step : 'session', qid: saved.qid || null };
  } catch (_) { return null; }
}

const loaded = load();
let S = loaded ? loaded.S : blank();
let step = loaded ? loaded.step : 'session';
let mode = 'interview';   // 'interview' (guided questions, always the starting view) or 'form'
let qid = loaded ? loaded.qid : null;            // current interview question id
let qIndex = 0;

let saveTimer;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ S, step, mode, qid })); } catch (_) { /* storage unavailable */ }
  }, 250);
}

/* =====================================================================
 * Helpers
 * ===================================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const DXMAP = Object.fromEntries(DX.map(d => [d.id, d]));
const uniq = a => [...new Set(a)];

function getPath(o, path) { return path.split('.').reduce((a, k) => (a == null ? a : a[k]), o); }
function setPath(o, path, val) {
  const keys = path.split('.');
  const last = keys.pop();
  let cur = o;
  for (const k of keys) {
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {};
    cur = cur[k];
  }
  cur[last] = val;
}

const lcFirst = s => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
const trim = s => (s || '').trim();
const capFirst = s => (s ? s[0].toUpperCase() + s.slice(1) : s);
// Capitalize and make sure free text ends with terminal punctuation.
const sentence = s => { const t = capFirst(trim(s)); return !t || /[.!?"”)]$/.test(t) ? t : t + '.'; };
const joinList = a => (a.length <= 1 ? (a[0] || '') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`);

function fmtDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return iso || '';
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m[2] - 1];
  return `${mon} ${+m[3]}, ${m[1]}`;
}
function fmtTime(t) {
  const m = /^(\d{2}):(\d{2})$/.exec(t || '');
  if (!m) return '';
  const h = +m[1];
  return `${((h + 11) % 12) + 1}:${m[2]} ${h < 12 ? 'AM' : 'PM'}`;
}
const toMin = t => { const m = /^(\d{2}):(\d{2})$/.exec(t || ''); return m ? +m[1] * 60 + +m[2] : null; };
function duration() {
  const a = toMin(S.session.start), b = toMin(S.session.end);
  if (a == null || b == null) return null;
  let d = b - a;
  if (d < 0) d += 1440;
  return d;
}
const CPT_RULES = { '90832': [16, 37], '90834': [38, 52], '90837': [53, Infinity], '90839': [30, 74] };

function dxLabel(d) {
  if (d.custom) return `${d.code ? d.code + ' ' : ''}${d.name}`.trim();
  const ref = DXMAP[d.id];
  if (!ref) return d.name || '';
  if (Array.isArray(ref.code)) {
    const opt = ref.code.find(o => o[1] === d.code && (o[0] === d.codeLabel || !d.codeLabel));
    return opt ? `${opt[1]} ${ref.name} — ${opt[0]}` : `${ref.name} (specifier / code not selected)`;
  }
  return `${ref.code} ${ref.name}`;
}
const dxName = d => (d.custom ? d.name : (DXMAP[d.id] || {}).name || '');
const selectedRefs = () => S.dx.map(d => DXMAP[d.id]).filter(Boolean);

// Assign innerHTML only when it changed, so a re-render triggered by a blur/change
// event never replaces the element the user is in the middle of clicking.
function setHTML(el, html) {
  if (el._html === html) return;
  el._html = html;
  el.innerHTML = html;
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2200);
}

/* =====================================================================
 * Note generation
 * ===================================================================== */
const lookup = (opts, v) => (opts.find(o => o[0] === v) || [])[1] || '';

function blockHeader() {
  const s = S.session;
  const cpt = CPT_CODES.find(c => c[0] === s.cpt);
  const dur = duration();
  const time = s.start && s.end ? `${fmtTime(s.start)}–${fmtTime(s.end)}${dur != null ? ` (${dur} min)` : ''}` : '';
  const l1 = [
    s.clientId && `Client: ${s.clientId}`,
    s.date && `Date: ${fmtDate(s.date)}`,
    time && `Time: ${time}`,
    s.sessionNum && `Session #: ${s.sessionNum}`,
  ].filter(Boolean).join('   ');
  const l2 = [
    cpt && `Service: ${cpt[0]} – ${cpt[1]}`,
    s.modality && `Format: ${s.modality}`,
    s.participants && `Participants: ${s.participants}`,
  ].filter(Boolean).join('   ');
  return ['PSYCHOTHERAPY PROGRESS NOTE', l1, l2, s.practitioner && `Clinician: ${s.practitioner}`].filter(Boolean).join('\n');
}

function blockDx() {
  if (!S.dx.length) return '';
  const lines = S.dx.map(d => `- ${dxLabel(d)}${d.primary ? ' (primary)' : ''}`);
  return `Diagnoses:\n${lines.join('\n')}`;
}

function blockReport() {
  const s = S.subj;
  const parts = [];
  if (trim(s.since)) parts.push(sentence(s.since));
  if (trim(s.quote)) {
    const qt = trim(s.quote).replace(/^["“']+|["”']+$/g, '');
    parts.push(`In the client's words: "${/[.!?]$/.test(qt) ? qt : qt + '.'}"`);
  }
  if (trim(s.events)) parts.push(`Notable events since last session: ${trim(s.events).split(/;\s*/).map(lcFirst).join('; ').replace(/[.;\s]*$/, '.')}`);
  if (trim(s.focus)) parts.push(`Client identified today's focus as ${lcFirst(trim(s.focus)).replace(/[.!?]+$/, '')}.`);
  if (trim(s.report)) parts.push(sentence(s.report));
  return parts.join(' ');
}

function blockSx() {
  const out = [];
  for (const d of S.dx) {
    const ref = DXMAP[d.id];
    if (!ref) continue;
    const groups = { present: [], worsened: [], improved: [], absent: [] };
    ref.sx.forEach((txt, i) => { const st = d.sx && d.sx[i]; if (groups[st]) groups[st].push(lcFirst(txt)); });
    const parts = [];
    if (groups.present.length) parts.push(`present – ${groups.present.join('; ')}`);
    if (groups.worsened.length) parts.push(`worsened – ${groups.worsened.join('; ')}`);
    if (groups.improved.length) parts.push(`improved – ${groups.improved.join('; ')}`);
    if (groups.absent.length) parts.push(`not present – ${groups.absent.join('; ')}`);
    if (parts.length) out.push(`Symptom status since last session (${ref.name}): ${parts.join('. ')}.`);
  }
  return out.join('\n');
}

function blockMse() {
  const bits = [];
  for (const f of MSE_FIELDS) {
    const v = S.mse[f.key];
    if (v) bits.push(`${f.short || f.label}: ${lcFirst(v)}`);
  }
  if (trim(S.mse.mood)) bits.splice(3, 0, `Mood (client's words): "${trim(S.mse.mood)}"`);
  return bits.length ? `Mental status – ${bits.join('; ')}.` : '';
}

function blockObs() { return trim(S.obsNotes) ? `Clinician observations: ${trim(S.obsNotes)}` : ''; }

function blockMeasures() {
  const ms = S.measures.filter(m => trim(m.name) && trim(m.score));
  if (!ms.length) return '';
  return `Measures: ${ms.map(m => `${trim(m.name)} = ${trim(m.score)}${trim(m.prev) ? ` (previous ${trim(m.prev)})` : ''}`).join('; ')}.`;
}

function riskLines() {
  const r = S.risk;
  const out = [];
  const si = lookup(SI_OPTS, r.si), hi = lookup(HI_OPTS, r.hi), sh = lookup(SH_OPTS, r.sh), ab = lookup(ABUSE_OPTS, r.abuse);
  if (si) out.push(`Suicide risk: ${si}.${trim(r.siDetail) ? ' ' + trim(r.siDetail) : ''}`);
  if (hi) out.push(`Violence risk: ${hi}.`);
  if (sh) out.push(`Self-harm: ${sh}.`);
  if (ab) out.push(`Abuse/neglect/IPV: ${ab}.`);
  if (r.protective.length) out.push(`Protective factors: ${r.protective.map(lcFirst).join('; ')}.`);
  if (r.level) out.push(`Clinician-assessed acute risk level: ${r.level}.`);
  if (r.actions.length) out.push(`Risk-related actions: ${r.actions.map(lcFirst).join('; ')}.`);
  if (trim(r.notes)) out.push(`Risk rationale/notes: ${trim(r.notes)}`);
  return out;
}
function blockRisk() { const l = riskLines(); return l.length ? `Risk assessment:\n${l.map(x => '- ' + x).join('\n')}` : ''; }

function selectedInts() {
  const ids = Object.keys(S.int).filter(id => S.int[id] && S.int[id].on && INTERVENTIONS[id]);
  return ids.map(id => ({ id, label: INTERVENTIONS[id][0], detail: trim(S.int[id].detail), goal: S.int[id].goal }));
}
function blockInts() {
  const lines = selectedInts().map(it => {
    const g = it.goal !== '' && it.goal != null && S.goals[+it.goal] ? ` [Goal ${+it.goal + 1}]` : '';
    return `- ${it.label}${g}${it.detail ? ': ' + it.detail : ''}`;
  });
  if (trim(S.intOther)) lines.push(`- ${trim(S.intOther)}`);
  return lines.length ? `Interventions:\n${lines.join('\n')}` : '';
}
function blockResponse() { return trim(S.response) ? `Client response: ${trim(S.response)}` : ''; }

function blockGoals() {
  const lines = [];
  S.goals.forEach((g, i) => {
    if (!trim(g.text) || !g.progress || g.progress === PROGRESS_OPTS[0]) return;
    lines.push(`${i + 1}. ${trim(g.text)}\n   Progress: ${g.progress}.${trim(g.comment) ? ' ' + sentence(g.comment) : ''}`);
  });
  return lines.length ? `Treatment goals addressed:\n${lines.join('\n')}` : '';
}
function blockImpression() { return trim(S.impression) ? `Clinical impression: ${trim(S.impression)}` : ''; }

function blockFunc() {
  const f = S.func;
  const parts = [];
  const doms = f.domains.map(d => lcFirst(d).replace(' / ', '/'));
  // Skip the list when the rationale already names every domain (e.g., a drafted statement).
  if (doms.length && !doms.every(d => trim(f.statement).toLowerCase().includes(d.toLowerCase()))) parts.push(`Current symptoms continue to affect functioning in: ${doms.join(', ')}.`);
  if (trim(f.statement)) parts.push(trim(f.statement));
  const rec = lookup(RECOMMENDATIONS, f.rec);
  if (rec && f.rec) parts.push(`Treatment recommendation: ${lcFirst(rec)}.`);
  return parts.length ? `Functional impact / medical necessity: ${parts.join(' ')}` : '';
}

function blockPlan() {
  const p = S.plan;
  const lines = [];
  if (trim(p.next) || p.freq) lines.push(`Next session: ${[trim(p.next), p.freq && `frequency ${p.freq.toLowerCase()}`].filter(Boolean).join(', ')}`);
  if (trim(p.focus)) lines.push(`Focus of next session: ${trim(p.focus)}`);
  if (trim(p.homework)) lines.push(`Between-session assignment: ${trim(p.homework)}`);
  if (trim(p.coord)) lines.push(`Coordination of care / referrals: ${trim(p.coord)}`);
  if (trim(p.change)) lines.push(`Treatment plan changes: ${trim(p.change)}`);
  return lines.length ? lines.map(l => '- ' + l).join('\n') : '';
}

const FORMATS = {
  soap: [
    ['S – SUBJECTIVE', ['report', 'sx']],
    ['O – OBJECTIVE', ['mse', 'obs', 'meas', 'ints', 'resp']],
    ['A – ASSESSMENT', ['dx', 'imp', 'goals', 'risk', 'func']],
    ['P – PLAN', ['plan']],
  ],
  dap: [
    ['D – DATA', ['report', 'sx', 'mse', 'obs', 'meas', 'ints', 'resp']],
    ['A – ASSESSMENT', ['dx', 'imp', 'goals', 'risk', 'func']],
    ['P – PLAN', ['plan']],
  ],
  birp: [
    ['B – BEHAVIOR', ['report', 'sx', 'mse', 'obs', 'meas', 'risk']],
    ['I – INTERVENTION', ['dx', 'ints']],
    ['R – RESPONSE', ['resp', 'goals', 'imp', 'func']],
    ['P – PLAN', ['plan']],
  ],
  girp: [
    ['G – GOALS', ['dx', 'goals']],
    ['I – INTERVENTIONS', ['ints']],
    ['R – RESPONSE', ['report', 'sx', 'mse', 'obs', 'meas', 'resp', 'risk', 'imp', 'func']],
    ['P – PLAN', ['plan']],
  ],
  narrative: [
    ['PRESENTATION', ['dx', 'report', 'sx', 'mse', 'obs', 'meas']],
    ['RISK', ['risk']],
    ['INTERVENTIONS AND RESPONSE', ['ints', 'resp']],
    ['ASSESSMENT', ['imp', 'goals', 'func']],
    ['PLAN', ['plan']],
  ],
};

function buildNote() {
  const blocks = {
    dx: blockDx(), report: blockReport(), sx: blockSx(), mse: blockMse(), obs: blockObs(), meas: blockMeasures(),
    risk: blockRisk(), ints: blockInts(), resp: blockResponse(), goals: blockGoals(), imp: blockImpression(),
    func: blockFunc(), plan: blockPlan(),
  };
  const out = [blockHeader()];
  for (const [title, keys] of FORMATS[S.format] || FORMATS.soap) {
    const body = keys.map(k => blocks[k]).filter(Boolean).join('\n\n');
    out.push(`${title}\n${body || '(nothing entered yet)'}`);
  }
  return out.join('\n\n');
}

/* =====================================================================
 * Quality checks
 * ===================================================================== */
const LANG = [
  [/\b(good|great|nice|productive|fine|decent) session\b/i, 'Evaluative label for the session. Describe what happened (content, technique, client response) instead.'],
  [/\bnon-?complian(t|ce)\b/i, 'Describe the barrier instead (e.g., "did not complete the assignment because ___").'],
  [/\b(refus(ed|es|al)|resist(ant|ed|s|ance))\b/i, 'Consider neutral wording (e.g., "declined", "expressed ambivalence about ___") and record the client\'s stated reason.'],
  [/\b(claims?|claimed|alleg(es|ed|edly)|insists?|admit(s|ted)?)\b/i, '"Claims / admits / insists" imply doubt or blame. Use "reports" or "states".'],
  [/\b(manipulative|attention[- ]seeking|drug[- ]seeking|lazy|hysterical|crazy|psycho|dramatic|whiny)\b/i, 'Pejorative or judgmental term. Describe the observable behavior and its context.'],
  [/\b(addicts?|alcoholics?|junkies?|abusers?|schizophrenics?)\b/i, 'Use person-first language (e.g., "client with alcohol use disorder").'],
  [/\b(discussed|talked about|processed|vented|worked on issues|explored feelings)\b/i, 'Vague verb. Name the technique and what was done (e.g., "used a thought record to ___").'],
];
const PHI = [
  [/\b\d{3}-\d{2}-\d{4}\b/, 'a possible Social Security number'],
  [/\b(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/, 'a possible phone number'],
  [/[\w.+-]+@[\w-]+\.[\w.-]+/, 'an email address'],
  [/\b(dob|d\.o\.b\.|date of birth|born on)\b/i, 'a date of birth reference'],
  [/\b\d{1,5}\s+[A-Za-z]+(?:\s[A-Za-z]+)?\s(?:st|street|ave|avenue|rd|road|blvd|drive|dr|lane|ln)\b/i, 'a possible street address'],
];

function freeText() {
  const parts = [S.subj.since, S.subj.quote, S.subj.events, S.subj.focus, S.subj.report, S.mse.mood, S.obsNotes, S.risk.siDetail, S.risk.notes, S.intOther, S.response, S.impression, S.func.statement,
    S.plan.focus, S.plan.homework, S.plan.coord, S.plan.change, S.plan.next];
  Object.values(S.int).forEach(i => i && i.on && parts.push(i.detail));
  S.goals.forEach(g => parts.push(g.comment));
  return parts.map(trim).filter(Boolean).join('\n');
}

const len = s => trim(s).length;
const ok = (id, step_, title, tip) => ({ id, level: 'ok', step: step_, title, tip });
const warn = (id, step_, title, tip) => ({ id, level: 'warn', step: step_, title, tip });
const bad = (id, step_, title, tip) => ({ id, level: 'bad', step: step_, title, tip });

function runChecks() {
  const c = [];
  const s = S.session;

  // Identification
  if (!trim(s.clientId) || !s.date) c.push(bad('id', 'session', 'Client and date missing', 'Every note needs a client identifier (ID or initials) and the date of service.'));
  else if (/^[A-Z][a-z]+\s+[A-Z][a-z]+/.test(trim(s.clientId))) c.push(warn('id', 'session', 'Client ID looks like a full name', 'Use an ID or initials in this tool. Add the full name only inside your secure EHR.'));
  else c.push(ok('id', 'session', 'Client and date recorded', 'Identification is present.'));

  // Time / CPT
  const dur = duration();
  if (dur == null) c.push(warn('time', 'session', 'Start and end times missing', 'Record actual start/end times. Time-based CPT codes must be supported by the documented session time.'));
  else if (CPT_RULES[s.cpt]) {
    const [lo, hi] = CPT_RULES[s.cpt];
    if (dur < lo || dur > hi) c.push(bad('time', 'session', `Documented ${dur} min doesn't fit CPT ${s.cpt}`, `CPT ${s.cpt} expects ${lo}${hi === Infinity ? '+' : '–' + hi} minutes. Check the times or choose the code that matches the time spent.`));
    else c.push(ok('time', 'session', `Time (${dur} min) supports CPT ${s.cpt}`, 'Documented time matches the selected code.'));
  } else c.push(ok('time', 'session', `Session time recorded (${dur} min)`, 'Confirm payer rules for this service code.'));

  // Diagnosis
  if (!S.dx.length) c.push(bad('dx', 'dx', 'No diagnosis selected', 'Link the session to at least one DSM-5-TR diagnosis. It anchors medical necessity and guides symptom, intervention, and goal prompts.'));
  else {
    const unspec = S.dx.filter(d => !d.custom && Array.isArray(DXMAP[d.id].code) && !d.code);
    if (unspec.length) c.push(warn('dx', 'dx', 'Specifier / code not selected', `Choose the severity, episode, or type for: ${unspec.map(dxName).join('; ')}. It determines the billable ICD-10-CM code.`));
    else if (!S.dx.some(d => d.primary)) c.push(warn('dx', 'dx', 'No primary diagnosis', 'Mark which diagnosis is the primary focus of treatment.'));
    else c.push(ok('dx', 'dx', 'Diagnosis documented with code', 'Diagnosis and code are present.'));
  }

  // Symptoms
  const sxCount = S.dx.reduce((n, d) => n + Object.values(d.sx || {}).filter(Boolean).length, 0);
  if (S.dx.length) {
    if (sxCount >= 2) c.push(ok('sx', 'subj', 'Diagnosis-linked symptoms documented', `${sxCount} symptom status entries link the session content to the diagnosis.`));
    else if (sxCount === 1) c.push(warn('sx', 'subj', 'Only one symptom status recorded', 'Note how the main diagnostic symptoms are doing relative to baseline (present, improved, worsened, absent).'));
    else c.push(bad('sx', 'subj', 'No symptom status recorded', 'Document how diagnostic symptoms are presenting this session. This links the note to the diagnosis.'));
  }

  // Report
  const reportText = [S.subj.since, S.subj.events, S.subj.focus, S.subj.report].join(' ');
  const rl = len(reportText) + len(S.subj.quote);
  if (!rl) c.push(bad('report', 'subj', 'No client report', 'Summarize what the client reported: key events since last session, concerns, and themes.'));
  else if (rl < 60) c.push(warn('report', 'subj', 'Client report is very brief', 'Add the main themes, relevant events, and when helpful a short direct quote.'));
  else if (!len(S.subj.quote) && !/["“”]/.test(reportText)) c.push(warn('report', 'subj', 'Consider a direct quote', 'A short quote in the client\'s own words adds authenticity and clinical meaning.'));
  else c.push(ok('report', 'subj', 'Client report documented', 'Includes the client\'s perspective.'));

  // MSE / observations
  const mseN = MSE_FIELDS.filter(f => S.mse[f.key]).length + (len(S.mse.mood) ? 1 : 0);
  if (mseN >= 5 || (mseN >= 2 && len(S.obsNotes) >= 40)) c.push(ok('mse', 'obs', 'Objective observations documented', 'Mental status and/or clinician observations recorded.'));
  else if (mseN || len(S.obsNotes)) c.push(warn('mse', 'obs', 'Limited objective observations', 'Add more mental status elements (appearance, affect, thought process, etc.) or specific observed behaviors.'));
  else c.push(bad('mse', 'obs', 'No objective observations', 'Record what you observed (appearance, affect, speech, thought process, engagement), separate from what the client reported.'));

  // Measures
  const hasMeasure = S.measures.some(m => trim(m.name) && trim(m.score));
  if (hasMeasure) c.push(ok('meas', 'obs', 'Outcome measure recorded', 'Measurement-based care strengthens progress documentation.'));
  else c.push(warn('meas', 'obs', 'No standardized measure this session', 'Where appropriate, record a score (e.g., from the diagnosis\'s suggested measures) or note when it was last administered.'));

  // Risk
  const r = S.risk;
  const assessed = [r.si, r.hi].filter(Boolean).length;
  if (assessed === 2) c.push(ok('risk', 'risk', 'Suicide and violence risk assessed', 'Both domains documented.'));
  else if (assessed === 1) c.push(warn('risk', 'risk', 'Only one risk domain documented', 'Document both suicide and violence/harm-to-others screening (or why one was not indicated).'));
  else c.push(bad('risk', 'risk', 'Risk not documented', 'Record the risk screening, even when negative. If it was not assessed, document why.'));

  const elevated = (r.si && r.si !== 'none') || (r.hi && r.hi !== 'none') || r.sh === 'recent' || r.sh === 'ongoing' || r.level === 'Moderate' || r.level === 'High';
  const realActions = r.actions.filter(a => a !== 'No additional action required');
  if (elevated) {
    if (!realActions.length) c.push(bad('riskAct', 'risk', 'Elevated risk without documented action', 'Document what you did (safety plan, means counseling, consultation, level-of-care decision) and your rationale.'));
    else if (len(r.notes) + len(r.siDetail) < 25) c.push(warn('riskAct', 'risk', 'Add your risk reasoning', 'Briefly document risk and protective factors, the basis for your risk level, and the plan.'));
    else c.push(ok('riskAct', 'risk', 'Elevated risk addressed', 'Actions and rationale are documented.'));
  }
  if (r.abuse === 'reported' && !r.actions.some(a => /Mandated report|Duty-to-protect/.test(a)) && !len(r.notes)) {
    c.push(warn('abuse', 'risk', 'Abuse/neglect concern without documented response', 'Document the mandated-reporting analysis and any report made, per your state law.'));
  }

  // Interventions
  const ints = selectedInts();
  if (!ints.length && !len(S.intOther)) c.push(bad('ints', 'int', 'No interventions documented', 'Name the therapeutic interventions you actually used. This is the core of the service billed.'));
  else {
    const specific = ints.filter(i => i.detail.length >= 15).length;
    if (ints.length && specific === ints.length) c.push(ok('ints', 'int', 'Interventions are specific', 'Each intervention includes what was done.'));
    else if (specific) c.push(warn('ints', 'int', 'Some interventions lack specifics', 'For each checked intervention, add what you did (technique, content, tool) in a short phrase.'));
    else c.push(warn('ints', 'int', 'Interventions need specifics', 'Naming the modality isn\'t enough. Briefly describe the technique and content used this session.'));
  }

  // Goal linkage
  if (!S.goals.some(g => len(g.text))) c.push(bad('link', 'prog', 'No treatment goals listed', 'Add the goals from the treatment plan so interventions and progress can be tied to them.'));
  else if (ints.length && !ints.some(i => i.goal !== '' && i.goal != null && S.goals[+i.goal])) c.push(warn('link', 'int', 'Interventions not linked to goals', 'Link at least the main interventions to a treatment-plan goal to show the "golden thread."'));
  else c.push(ok('link', 'int', 'Goals and interventions connected', 'Interventions are tied to treatment goals.'));

  // Response
  const resp = len(S.response);
  if (!resp) c.push(bad('resp', 'int', 'Client response not documented', 'Describe how the client responded (engagement, skill use, insight, change in distress). This shows treatment is working or needs adjusting.'));
  else if (resp < 30) c.push(warn('resp', 'int', 'Client response is brief', 'Add specifics: skill rehearsed, distress rating change, insight, or barriers.'));
  else c.push(ok('resp', 'int', 'Client response documented', 'Response to interventions is recorded.'));

  // Progress
  const rated = S.goals.filter(g => len(g.text) && g.progress && g.progress !== PROGRESS_OPTS[0]).length;
  if (S.goals.some(g => len(g.text))) {
    if (rated) c.push(ok('prog', 'prog', 'Progress toward goals rated', `${rated} goal(s) rated this session.`));
    else c.push(warn('prog', 'prog', 'Goal progress not rated', 'Rate progress on the goal(s) addressed, with evidence (score change, behavior change, frequency).'));
  }

  // Impression
  const imp = len(S.impression);
  if (imp >= 60) c.push(ok('imp', 'prog', 'Clinical impression synthesized', 'Assessment goes beyond restating the session.'));
  else if (imp) c.push(warn('imp', 'prog', 'Clinical impression is brief', 'Synthesize: how do today\'s findings relate to the diagnosis, goals, and the need for any plan change?'));
  else c.push(warn('imp', 'prog', 'No clinical impression', 'Add your assessment of the client\'s status, response, and any diagnostic or treatment changes.'));

  // Medical necessity
  const fn = S.func;
  if (fn.domains.length && len(fn.statement) >= 30) c.push(ok('func', 'prog', 'Functional impairment / medical necessity supported', 'Impairment and rationale documented.'));
  else if (fn.domains.length || len(fn.statement)) c.push(warn('func', 'prog', 'Medical necessity needs more support', 'Select affected functional areas and add a sentence on why continued treatment at this level is needed.'));
  else c.push(bad('func', 'prog', 'Medical necessity not supported', 'Document how symptoms impair functioning and why this level of care is needed. This is the top reason for payer audit denials.'));

  // Plan
  const p = S.plan;
  const planParts = [len(p.next) || p.freq, len(p.focus) || len(p.homework)].filter(Boolean).length;
  if (planParts === 2) c.push(ok('plan', 'plan', 'Plan documented', 'Next session and next steps present.'));
  else if (planParts === 1) c.push(warn('plan', 'plan', 'Plan is incomplete', 'Include next appointment/frequency and the focus or between-session assignment.'));
  else c.push(bad('plan', 'plan', 'No plan documented', 'Record the next appointment, focus of next session, and any assignment or referral.'));

  // Language & privacy
  const text = freeText();
  const langHits = [];
  for (const [re, msg] of LANG) { const m = re.exec(text); if (m) langHits.push(`"${m[0]}": ${msg}`); }
  if (langHits.length) c.push({ id: 'lang', level: 'warn', step: 'subj', title: 'Language to review', tip: langHits.join('  •  ') });
  else if (text) c.push(ok('lang', 'subj', 'Neutral, professional language', 'No flagged wording found.'));

  const phiHits = PHI.filter(([re]) => re.test(text)).map(x => x[1]);
  if (phiHits.length) c.push(bad('phi', 'subj', 'Possible identifying information in text', `Found ${phiHits.join(', ')}. Remove identifiers from this tool, and apply the minimum-necessary standard.`));

  return c;
}

/* =====================================================================
 * Rendering – form steps
 * ===================================================================== */
const panel = $('#panel');

function field(label, path, opts = {}) {
  const v = getPath(S, path) ?? '';
  const id = 'f_' + path.replace(/\W/g, '_');
  const hint = opts.hint ? ` <span class="hint">${opts.hint}</span>` : '';
  let ctl;
  if (opts.type === 'textarea') ctl = `<textarea id="${id}" data-b="${path}" class="${opts.tall ? 'tall' : ''}" placeholder="${esc(opts.ph || '')}">${esc(v)}</textarea>`;
  else if (opts.type === 'select') ctl = `<select id="${id}" data-b="${path}">${opts.options.map(o => { const [val, lab] = Array.isArray(o) ? o : [o, o || '— select —']; return `<option value="${esc(val)}"${val === v ? ' selected' : ''}>${esc(lab)}</option>`; }).join('')}</select>`;
  else ctl = `<input id="${id}" type="${opts.type || 'text'}" data-b="${path}" value="${esc(v)}" placeholder="${esc(opts.ph || '')}"${opts.list ? ` list="${opts.list}"` : ''}${opts.autocomplete ? ` autocomplete="${opts.autocomplete}"` : ' autocomplete="off"'}>`;
  return `<div class="field"><label for="${id}">${label}${hint}</label>${ctl}</div>`;
}

function chips(path, options, selected) {
  return `<div class="chips" role="group">${options.map(o => `<button type="button" class="chip" data-chip="${path}" data-val="${esc(o)}" aria-pressed="${selected.includes(o)}">${esc(o)}</button>`).join('')}</div>`;
}

function navRow(i) {
  const prev = STEPS[i - 1], next = STEPS[i + 1];
  return `<div class="nav-row">${prev ? `<button class="btn" data-go="${prev.id}">← ${prev.label}</button>` : '<span></span>'}${next ? `<button class="btn primary" data-go="${next.id}">${next.label} →</button>` : `<button class="btn primary" data-go-check>Review quality check</button>`}</div>`;
}

function head(title, lead) { return `<h2>${title}</h2><p class="lead">${lead}</p>`; }

const VIEWS = {
  session() {
    return head('Session details', 'Identify the encounter. Time and service code must agree for time-based billing.') +
      `<div class="grid2">${field('Client ID / initials <span class="hint">(no full names)</span>', 'session.clientId', { ph: 'e.g., JD-0412' })}${field('Session #', 'session.sessionNum', { type: 'number' })}</div>
       <div class="grid3">${field('Date of service', 'session.date', { type: 'date' })}${field('Start time', 'session.start', { type: 'time' })}${field('End time', 'session.end', { type: 'time' })}</div>
       ${field('Service (CPT)', 'session.cpt', { type: 'select', options: CPT_CODES.map(c => [c[0], `${c[0]} – ${c[1]}`]) })}
       <div class="grid2">${field('Format', 'session.modality', { type: 'select', options: MODALITIES })}${field('Participants', 'session.participants', { type: 'select', options: PARTICIPANTS })}</div>
       ${field('Clinician name / credentials <span class="hint">(optional)</span>', 'session.practitioner', { ph: 'e.g., A. Rivera, LCSW' })}`;
  },

  dx() {
    const cards = S.dx.map((d, i) => dxCard(d, i)).join('');
    return head('Diagnosis', 'Choose the client\'s DSM-5-TR diagnoses. The app then tailors symptom prompts, interventions, measures, and goals. Add the diagnosis you have already made. The app does not diagnose.') +
      `<div class="field"><label for="dxSearch">Search diagnoses <span class="hint">name, ICD-10 code, or category</span></label>
         <input type="search" id="dxSearch" placeholder="e.g., depress, F43, anxiety, OCD" autocomplete="off">
         <div class="dx-results" id="dxResults" role="listbox" aria-label="Diagnosis results"></div></div>
       <details class="guide"><summary>Add a diagnosis not in the list</summary><div class="gbody"><div class="grid2">
         <div class="field"><label for="cdxCode">ICD-10-CM code</label><input id="cdxCode" type="text" placeholder="e.g., F43.9"></div>
         <div class="field"><label for="cdxName">Diagnosis name</label><input id="cdxName" type="text" placeholder="Name"></div></div>
         <button class="btn small" data-action="add-custom">Add diagnosis</button></div></details>
       <div id="dxCards">${cards || '<p class="hint" style="margin-top:14px">No diagnosis selected yet.</p>'}</div>
       <div class="callout">Symptom lists here are short paraphrased prompts, not the DSM-5-TR criteria. Confirm criteria, duration, and exclusions in the DSM-5-TR. Verify ICD-10-CM codes against the current code set.</div>` + navRow(1);
  },

  subj() {
    const symptomBlocks = S.dx.map((d, i) => {
      const ref = DXMAP[d.id];
      if (!ref || !ref.sx.length) return '';
      return `<fieldset class="risk-box"><legend><strong>${esc(ref.name)}</strong> <span class="hint">status since last session</span></legend>
        ${ref.sx.map((txt, k) => {
          const v = (d.sx && d.sx[k]) || '';
          return `<div class="sx-row${v ? ' on' : ''}"><span id="sxl_${i}_${k}">${esc(txt)}</span>
            <select aria-labelledby="sxl_${i}_${k}" data-b="dx.${i}.sx.${k}" data-sx>${SYMPTOM_STATUS.map(o => `<option value="${o[0]}"${o[0] === v ? ' selected' : ''}>${o[1]}</option>`).join('')}</select></div>`;
        }).join('')}</fieldset>`;
    }).join('');
    return head('Client report & symptoms', 'Capture what the client reported in their words, and how diagnostic symptoms are doing compared with baseline.') +
      field('How has the client been since the last session?', 'subj.since', { type: 'textarea', tall: true, ph: 'What the client reported: key concerns and themes since last session.' }) +
      `<div class="field"><span class="hint">Sentence starters:</span><div class="chips">${SUBJECTIVE_STARTERS.map(t => `<button type="button" class="chip" data-action="starter" data-target="subj.since" data-text="${esc(t)}">${esc(t.trim())}</button>`).join('')}</div></div>` +
      `<div class="grid2">${field('Direct quote <span class="hint">(optional)</span>', 'subj.quote', { ph: "e.g., I just can't get going" })}${field('Client\'s focus for today', 'subj.focus')}</div>` +
      field('Notable events / stressors since last session', 'subj.events', { type: 'textarea' }) +
      field('Additional client report <span class="hint">(optional)</span>', 'subj.report', { type: 'textarea' }) +
      (symptomBlocks || '<p class="callout">Select a diagnosis in the previous step to get symptom prompts.</p>') + navRow(2);
  },

  obs() {
    const mse = MSE_FIELDS.map(f => `<div class="field"><label for="mse_${f.key}">${f.label}</label>
        <select id="mse_${f.key}" data-b="mse.${f.key}"><option value="">— not assessed —</option>${f.opts.map(o => `<option${o === S.mse[f.key] ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select></div>`).join('');
    return head('Objective observations', 'Document what you observed and measured, separate from the client\'s report.') +
      `<h3>Mental status</h3><div class="grid2">${mse}${field('Mood <span class="hint">(client\'s words)</span>', 'mse.mood', { ph: 'e.g., "overwhelmed"' })}</div>` +
      field('Other clinician observations', 'obsNotes', { type: 'textarea', ph: 'Observable behavior and presentation (e.g., tearful when discussing ___, fidgeting, minimal eye contact, engagement with tasks).' }) +
      `<h3>Standardized measures</h3>
       ${measuresUI()}` + navRow(3);
  },

  risk() {
    const r = S.risk;
    const radio = (path, opts) => opts.map(o => `<label class="radio"><input type="radio" name="${path}" data-b="${path}" value="${o[0]}"${getPath(S, path) === o[0] ? ' checked' : ''}> ${esc(o[1])}</label>`).join('');
    const elev = (r.si && r.si !== 'none') || (r.hi && r.hi !== 'none');
    return head('Risk assessment', 'Document risk screening every session where clinically indicated. Record your reasoning, not just a checkbox.') +
      `<div class="risk-box${elev ? ' alert' : ''}" id="riskBox"><h3>Suicide</h3>${radio('risk.si', SI_OPTS)}
        ${field('Details <span class="hint">frequency, plan, intent, access to means, recent behavior</span>', 'risk.siDetail', { type: 'textarea' })}</div>
       <div class="risk-box"><h3>Violence / harm to others</h3>${radio('risk.hi', HI_OPTS)}</div>
       <div class="risk-box"><h3>Self-harm</h3>${radio('risk.sh', SH_OPTS)}</div>
       <div class="risk-box"><h3>Abuse / neglect / IPV</h3>${radio('risk.abuse', ABUSE_OPTS)}</div>
       <h3>Protective factors</h3>${chips('risk.protective', PROTECTIVE, r.protective)}
       <div class="field" style="margin-top:14px"><label for="f_risk_level">Clinician-assessed acute risk level</label>
         <select id="f_risk_level" data-b="risk.level">${['', 'Low', 'Moderate', 'High'].map(v => `<option value="${v}"${v === r.level ? ' selected' : ''}>${v || '— not recorded —'}</option>`).join('')}</select></div>
       <h3>Actions taken</h3>${chips('risk.actions', RISK_ACTIONS, r.actions)}
       <div style="margin-top:14px">${field('Risk rationale / notes', 'risk.notes', { type: 'textarea', ph: 'Basis for risk level, consultation, follow-up plan, level-of-care decision.' })}</div>` + navRow(4);
  },

  int() {
    const recIds = uniq(selectedRefs().flatMap(r => r.i)).filter(id => INTERVENTIONS[id]);
    const genIds = GENERAL_INTERVENTIONS.filter(id => !recIds.includes(id));
    const item = (id, rec) => {
      const it = S.int[id] || {};
      const goalOpts = `<option value="">Link to goal…</option>` + S.goals.map((g, i) => `<option value="${i}"${String(it.goal) === String(i) ? ' selected' : ''}>Goal ${i + 1}: ${esc(trim(g.text).slice(0, 38) || '(untitled)')}</option>`).join('');
      return `<div class="int-item${it.on ? ' on' : ''}" data-int="${id}">
        <div class="row"><input type="checkbox" id="int_${id}" data-b="int.${id}.on"${it.on ? ' checked' : ''}><label for="int_${id}">${esc(INTERVENTIONS[id][0])}</label>${rec ? '<span class="rec">recommended</span>' : ''}</div>
        <div class="more"${it.on ? '' : ' hidden'}><input type="text" aria-label="What you did: ${esc(INTERVENTIONS[id][0])}" data-b="int.${id}.detail" value="${esc(it.detail || '')}" placeholder="${esc(INTERVENTIONS[id][1])}"><select aria-label="Linked goal" data-b="int.${id}.goal">${goalOpts}</select></div></div>`;
    };
    return head('Interventions & response', 'Check what you actually did, add specifics, and link it to a treatment goal. Then document how the client responded.') +
      (recIds.length ? `<h3>Evidence-based options for the selected diagnosis</h3>${recIds.map(id => item(id, true)).join('')}` : '') +
      `<h3 style="margin-top:16px">General interventions</h3>${genIds.map(id => item(id, false)).join('')}` +
      field('Other interventions <span class="hint">(optional)</span>', 'intOther', { type: 'textarea', ph: 'Anything not listed above, with specifics.' }) +
      field('Client response to interventions', 'response', { type: 'textarea', tall: true, ph: 'Engagement, skill use, change in distress ratings, insight, barriers. Example: "Client practiced paced breathing; SUDS fell 7→4. Identified thought \'I always fail\' and generated an alternative."' }) +
      `<div class="chips">${['Client was engaged and receptive to ', 'Client practiced ', 'Client\'s distress changed from __/10 to __/10 after ', 'Client expressed ambivalence about ', 'Barrier to progress identified: '].map(t => `<button type="button" class="chip" data-action="starter" data-target="response" data-text="${esc(t)}">${esc(t.trim())}</button>`).join('')}</div>` + navRow(5);
  },

  prog() {
    const sug = uniq(selectedRefs().flatMap(r => r.g));
    const have = new Set(S.goals.map(g => trim(g.text)));
    const goals = S.goals.map((g, i) => `<div class="goal"><div class="gh"><strong>Goal ${i + 1}</strong><button class="btn small danger" data-action="rm-goal" data-idx="${i}" aria-label="Remove goal ${i + 1}">Remove</button></div>
        <textarea data-b="goals.${i}.text" aria-label="Goal ${i + 1} text" placeholder="Measurable goal from the treatment plan">${esc(g.text)}</textarea>
        <div class="grid2"><select data-b="goals.${i}.progress" aria-label="Progress on goal ${i + 1}"><option value="">Progress this session…</option>${PROGRESS_OPTS.map(o => `<option${o === g.progress ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>
        <input type="text" data-b="goals.${i}.comment" aria-label="Evidence of progress for goal ${i + 1}" value="${esc(g.comment)}" placeholder="Evidence (score change, behavior, frequency)"></div></div>`).join('');
    return head('Progress & medical necessity', 'Show progress toward treatment-plan goals and why continued treatment is needed.') +
      `<h3>Treatment goals</h3>${goals || '<p class="hint">No goals yet. Add from the treatment plan or use a suggestion.</p>'}
       <button class="btn small" data-action="add-goal" data-text="">+ Add goal</button>
       ${sug.length ? `<details class="guide" style="margin-top:12px"><summary>Goal suggestions for the selected diagnosis (edit the [brackets])</summary><div class="gbody suggest">${sug.map(t => `<button class="btn small" data-action="add-goal" data-text="${esc(t)}" ${have.has(t) ? 'disabled' : ''}>+ ${esc(t)}</button>`).join('')}</div></details>` : ''}
       <div style="margin-top:18px">${field('Clinical impression', 'impression', { type: 'textarea', tall: true, ph: 'Synthesize rather than repeat: How do today\'s presentation, symptom change, and response to interventions relate to the diagnosis and goals? Any diagnostic or treatment-plan changes?' })}</div>
       <h3>Functional impact</h3><p class="hint">Areas where symptoms currently impair functioning:</p>${chips('func.domains', IMPAIRMENT, S.func.domains)}
       <div style="margin-top:14px">${field('Medical necessity rationale', 'func.statement', { type: 'textarea', ph: 'Example: "Despite improved sleep, client continues to miss work 2 days/week due to low energy and avoidance; weekly CBT remains necessary to reach goal 1."' })}
       ${field('Treatment recommendation', 'func.rec', { type: 'select', options: RECOMMENDATIONS })}</div>` + navRow(6);
  },

  plan() {
    return head('Plan', 'Close the loop: next steps, assignments, and coordination.') +
      `<div class="grid2">${field('Next appointment', 'plan.next', { ph: 'e.g., Oct 18, 2:00 PM' })}${field('Frequency', 'plan.freq', { type: 'select', options: FREQUENCIES })}</div>` +
      field('Focus of next session', 'plan.focus', { type: 'textarea' }) +
      field('Between-session assignment', 'plan.homework', { type: 'textarea', ph: 'Specific, measurable (e.g., complete 3 thought records; log sleep nightly).' }) +
      field('Coordination of care / referrals', 'plan.coord', { type: 'textarea', ph: 'e.g., sent update to prescriber (ROI on file); referred for psychiatric evaluation.' }) +
      field('Changes to treatment plan', 'plan.change', { type: 'textarea', ph: 'Goal revisions, frequency change, new diagnoses, discharge criteria.' }) +
      `<div class="callout">Finished? Open the <strong>Quality check</strong> tab, fix flagged items, then copy the note into your EHR and review it before signing.</div>` + navRow(7);
  },
};

function dxCard(d, i) {
  const ref = DXMAP[d.id];
  let codeUI;
  if (d.custom) codeUI = `<span class="tag">${esc(d.code || 'no code')}</span>`;
  else if (Array.isArray(ref.code)) {
    const sel = d.code ? `${d.code}|${d.codeLabel || ''}` : '';
    codeUI = `<label class="hint" style="margin:0" for="dxc_${i}">Specifier / code</label><select id="dxc_${i}" data-action="set-code" data-idx="${i}" style="min-width:230px;width:auto"><option value="">— select —</option>${ref.code.map(o => `<option value="${esc(o[1])}|${esc(o[0])}"${sel === o[1] + '|' + o[0] ? ' selected' : ''}>${esc(o[1])} – ${esc(o[0])}</option>`).join('')}</select>`;
  } else codeUI = `<span class="tag">${esc(ref.code)}</span>`;
  const guide = ref ? `<details class="guide"><summary>Clinical guide: ${esc(ref.name)}</summary><div class="gbody">
      ${ref.t ? `<h4>Documentation tips</h4><p>${esc(ref.t)}</p>` : ''}
      ${ref.r ? `<h4>Risk considerations</h4><p>${esc(ref.r)}</p>` : ''}
      ${ref.m.length ? `<h4>Suggested measures</h4><ul>${ref.m.map(m => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}
      ${ref.i.length ? `<h4>Evidence-based interventions</h4><ul>${ref.i.filter(x => INTERVENTIONS[x]).map(x => `<li>${esc(INTERVENTIONS[x][0])}</li>`).join('')}</ul>` : ''}
      ${ref.g.length ? `<h4>Example measurable goals</h4><ul>${ref.g.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${ref.d ? `<h4>Consider ruling out</h4><p>${esc(ref.d)}</p>` : ''}
    </div></details>` : '';
  return `<div class="card"><header><div><h3>${esc(dxName(d))}</h3></div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <label class="radio" style="margin:0"><input type="radio" name="primaryDx" data-action="set-primary" data-idx="${i}"${d.primary ? ' checked' : ''}> Primary</label>
        <button class="btn small danger" data-action="rm-dx" data-idx="${i}">Remove</button></div></header>
    <div class="body"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${codeUI}</div>${guide}</div></div>`;
}

function renderDxResults() {
  const box = $('#dxResults');
  if (!box) return;
  const q = trim($('#dxSearch').value).toLowerCase();
  const have = new Set(S.dx.map(d => d.id));
  const list = DX.filter(d => !q || d.name.toLowerCase().includes(q) || d.cat.toLowerCase().includes(q) ||
    (Array.isArray(d.code) ? d.code.some(c => c[1].toLowerCase().includes(q)) : d.code.toLowerCase().includes(q)));
  box.innerHTML = list.length ? list.map(d => `<button type="button" role="option" data-action="add-dx" data-id="${d.id}"${have.has(d.id) ? ' disabled' : ''}>
      <span>${esc(d.name)}${have.has(d.id) ? ' ✓' : ''}</span><span class="cat">${esc(d.cat)} · ${esc(Array.isArray(d.code) ? d.code[0][1].replace(/\..*/, '') + '.x' : d.code)}</span></button>`).join('')
    : '<div class="empty">No matches. Use "Add a diagnosis not in the list" below.</div>';
}

function measuresUI() {
  const sugg = uniq(selectedRefs().flatMap(r => r.m));
  const used = new Set(S.measures.map(m => trim(m.name)));
  return `${sugg.length ? `<p class="hint">Suggested for the selected diagnosis:</p><div class="chips" style="margin-bottom:10px">${sugg.map(m => `<button type="button" class="chip" data-action="add-measure" data-name="${esc(m)}" ${used.has(m) ? 'disabled' : ''}>+ ${esc(m)}</button>`).join('')}</div>` : ''}
    <div id="measureList">${S.measures.map((m, i) => `<div class="measure">
      <div><label for="m_n${i}">Measure</label><input id="m_n${i}" data-b="measures.${i}.name" value="${esc(m.name)}"></div>
      <div><label for="m_s${i}">Score today</label><input id="m_s${i}" data-b="measures.${i}.score" value="${esc(m.score)}"></div>
      <div><label for="m_p${i}">Previous</label><input id="m_p${i}" data-b="measures.${i}.prev" value="${esc(m.prev)}"></div>
      <button class="btn small danger" data-action="rm-measure" data-idx="${i}" aria-label="Remove measure">✕</button></div>`).join('')}</div>
    <button class="btn small" data-action="add-measure" data-name="">+ Add measure</button>`;
}

/* =====================================================================
 * Guided interview mode: one question at a time, all answers write to S
 * ===================================================================== */
const MSE_WNL = {
  appearance: 'Casually dressed, adequately groomed', behavior: 'Cooperative, engaged, good eye contact', speech: 'Normal rate, volume, and tone',
  affect: 'Full range, congruent with mood', thoughtProcess: 'Linear and goal-directed', thoughtContent: 'No delusions or obsessions noted',
  perception: 'No hallucinations reported or observed', cognition: 'Alert and oriented x4', insight: 'Good', judgment: 'Intact',
};
const SX_BUTTONS = [['present', 'Present'], ['improved', 'Improved'], ['worsened', 'Worsened'], ['absent', 'Not present']];
const EVENT_TAGS = ['Work or school stress', 'Family conflict', 'Relationship change', 'Health or medication change', 'Loss or grief', 'Substance use', 'Financial or housing stress', 'Legal issue', 'Positive event or achievement', 'No significant changes reported'];
const OBS_STARTERS = ['Client was tearful when discussing ', 'Client fidgeted throughout the session.', 'Client actively engaged in session tasks.', 'Eye contact decreased when discussing ', 'Client appeared visibly calmer by the end of session.', 'Client arrived late, reporting '];
const RESPONSE_STARTERS = ['Client was engaged and receptive to ', 'Client practiced ', 'Client\'s distress changed from __/10 to __/10 after ', 'Client identified ', 'Client expressed ambivalence about ', 'Barrier to progress identified: '];
const HOMEWORK = {
  ba: 'Complete the scheduled activities and rate mood before and after each.',
  cbt: 'Complete at least three thought records when noticing a mood shift.',
  exp: 'Practice the agreed exposure daily and record SUDS before, at peak, and after.',
  erp: 'Complete daily ERP practice without performing the ritual and log SUDS.',
  pe: 'Listen to the imaginal exposure recording daily and complete the in vivo assignment.',
  cpt: 'Complete the assigned CPT worksheet on the identified stuck point.',
  dbt: 'Complete the diary card daily and practice the skill taught this session.',
  mind: 'Practice the mindfulness exercise for 10 minutes daily.',
  relax: 'Practice diaphragmatic breathing twice daily and before stressful situations.',
  ground: 'Use the grounding skill when distress rises and note SUDS before and after.',
  cbti: 'Keep the sleep diary and follow the agreed sleep window and rise time.',
  selfmon: 'Track target symptoms daily using the log provided.',
  safety: 'Keep the safety plan accessible and share it with a support person.',
  act: 'Take the committed-action step identified in session.',
  ps: 'Carry out the first step of the problem-solving plan.',
  mi: 'Reflect on the pros and cons of change discussed today.',
  sst: 'Practice the rehearsed social skill in at least one real situation.',
  hrt: 'Use the competing response at each urge and log episodes.',
  pmt: 'Caregivers to use the practiced strategy daily and track target behavior.',
  orgskills: 'Use the planner system daily and bring it to next session.',
};
const FREQ_ADJ = { 'Weekly': 'weekly', 'Every other week': 'biweekly', 'Twice weekly': 'twice-weekly', 'Monthly': 'monthly' };

const riskElevated = () => { const r = S.risk; return (r.si && r.si !== 'none') || (r.hi && r.hi !== 'none') || r.sh === 'recent' || r.sh === 'ongoing' || r.level === 'Moderate' || r.level === 'High'; };
const recommendedInts = () => uniq(selectedRefs().flatMap(r => r.i)).filter(id => INTERVENTIONS[id]);
function suggestedCpt() {
  const d = duration();
  if (d == null || d < 16) return null;
  return d >= 53 ? '90837' : d >= 38 ? '90834' : '90832';
}

function questions() {
  const Q = [];
  const add = q => Q.push(q);

  add({ id: 'session', sec: 'session', type: 'session', title: 'Session details', help: 'Fill these in once, then answer a few questions and your note is written for you.' });

  add({ id: 'dx', sec: 'dx', type: 'dx', title: 'What is the client\'s diagnosis?', help: 'Choose the diagnosis you have already made, then pick the specifier. The rest of the questions adapt to it. The app does not diagnose.' });

  add({ id: 'since', sec: 'subj', type: 'text', path: 'subj.since', title: 'How has the client been since the last session?', help: 'Summarize what the client reported in a sentence or two.',
    ph: 'e.g., Client reported low mood most days this week and missed two days of work.', chips: SUBJECTIVE_STARTERS });
  add({ id: 'quote', sec: 'subj', type: 'line', path: 'subj.quote', title: 'Is there a short quote in the client\'s own words worth including?', help: 'Optional. Quotation marks are added for you.', ph: 'e.g., I just can\'t get going' });
  add({ id: 'events', sec: 'subj', type: 'text', path: 'subj.events', tall: false, title: 'Any notable events or stressors since the last session?', chips: EVENT_TAGS, sep: '; ' });
  add({ id: 'focus', sec: 'subj', type: 'line', path: 'subj.focus', title: 'What did the client want to focus on today?', ph: 'e.g., managing stress at work' });
  S.dx.forEach((d, i) => {
    const ref = DXMAP[d.id];
    if (ref && ref.sx.length) add({ id: 'sx_' + d.id, sec: 'subj', type: 'sx', idx: i, title: `How are the ${ref.name} symptoms compared with last session?`, help: 'Mark only the symptoms that came up. Tap again to clear.' });
  });

  add({ id: 'mse', sec: 'obs', type: 'mse', title: 'How did the client present?', help: 'Set anything notable, then fill the rest as within normal limits.' });
  add({ id: 'mood', sec: 'obs', type: 'line', path: 'mse.mood', title: 'How did the client describe their mood?', help: 'Use their words, e.g., "tired", "a little better".' });
  add({ id: 'obs', sec: 'obs', type: 'text', path: 'obsNotes', tall: false, title: 'Anything else you observed?', help: 'Optional. Describe observable behavior, not interpretation.', chips: OBS_STARTERS });
  add({ id: 'measures', sec: 'obs', type: 'measures', title: 'Did you give a standardized measure?', help: 'Optional. Enter today\'s score and the previous one to show change.' });

  add({ id: 'si', sec: 'risk', type: 'single', path: 'risk.si', title: 'Suicide risk: what did your screening show?', options: SI_OPTS });
  if (S.risk.si && S.risk.si !== 'none') add({ id: 'siDetail', sec: 'risk', type: 'text', path: 'risk.siDetail', tall: false, title: 'Describe the suicidal ideation.', help: 'Frequency, duration, plan, intent, access to means, prior attempts, recent behavior.' });
  add({ id: 'hi', sec: 'risk', type: 'single', path: 'risk.hi', title: 'Violence risk: any thoughts of harming others?', options: HI_OPTS });
  add({ id: 'sh', sec: 'risk', type: 'single', path: 'risk.sh', title: 'Any self-harm urges or behavior?', options: SH_OPTS });
  add({ id: 'abuse', sec: 'risk', type: 'single', path: 'risk.abuse', title: 'Any abuse, neglect, or intimate partner violence concerns?', options: ABUSE_OPTS });
  add({ id: 'protective', sec: 'risk', type: 'multi', path: 'risk.protective', title: 'Which protective factors are present?', help: 'Select all that apply.', options: PROTECTIVE });
  add({ id: 'level', sec: 'risk', type: 'single', path: 'risk.level', title: 'What is your overall acute risk level?', options: [['Low', 'Low'], ['Moderate', 'Moderate'], ['High', 'High']] });
  add({ id: 'actions', sec: 'risk', type: 'multi', path: 'risk.actions', title: 'What risk-related actions did you take?', help: 'Select all that apply.', options: RISK_ACTIONS });
  if (riskElevated()) add({ id: 'riskNotes', sec: 'risk', type: 'text', path: 'risk.notes', tall: false, title: 'What is your reasoning for the risk level and plan?', help: 'Risk and protective factors weighed, consultation, follow-up, level-of-care decision.' });

  add({ id: 'ints', sec: 'int', type: 'ints', title: 'Which interventions did you use?', help: 'Select everything you actually did this session.' });
  selectedInts().forEach(it => add({ id: 'int_' + it.id, sec: 'int', type: 'intdetail', intId: it.id, title: `${it.label}: what specifically did you do?`, help: 'A phrase or two: the technique, the content, and any ratings.' }));
  add({ id: 'response', sec: 'int', type: 'text', path: 'response', title: 'How did the client respond?', help: 'Engagement, skill use, change in distress ratings, insight, or barriers.', chips: RESPONSE_STARTERS });

  add({ id: 'goals', sec: 'prog', type: 'goals', title: 'Which treatment-plan goals did you work on?', help: 'Add the goals from the client\'s treatment plan. They carry over to the next session.' });
  S.goals.forEach((g, i) => { if (len(g.text)) add({ id: 'goal_' + i, sec: 'prog', type: 'goalprog', idx: i, title: `How much progress on goal ${i + 1}?` }); });
  add({ id: 'func', sec: 'prog', type: 'multi', path: 'func.domains', title: 'Where do symptoms still affect the client\'s daily functioning?', help: 'Select all that apply. This supports medical necessity.', options: IMPAIRMENT });
  add({ id: 'rec', sec: 'prog', type: 'single', path: 'func.rec', title: 'What do you recommend for treatment going forward?', options: RECOMMENDATIONS.slice(1) });
  add({ id: 'impression', sec: 'prog', type: 'draft', draft: 'impression', path: 'impression', title: 'What is your clinical impression?', help: 'Synthesize rather than repeat: how today\'s presentation and response relate to the diagnosis and goals.' });
  add({ id: 'funcStatement', sec: 'prog', type: 'draft', draft: 'necessity', path: 'func.statement', title: 'Why is continued treatment medically necessary?', help: 'Tie current impairment to the diagnosis and the level of care.' });

  add({ id: 'next', sec: 'plan', type: 'fields', grid: 'grid2', title: 'When is the next session?', fields: [['Next appointment', 'plan.next', { ph: 'e.g., Oct 18, 2:00 PM' }], ['Frequency', 'plan.freq', { type: 'select', options: FREQUENCIES }]] });
  add({ id: 'focusNext', sec: 'plan', type: 'text', path: 'plan.focus', tall: false, title: 'What will the next session focus on?', chips: ['Review between-session assignment.', 'Continue current treatment focus.', 'Review and update safety plan.', 'Readminister outcome measure.'] });
  add({ id: 'homework', sec: 'plan', type: 'text', path: 'plan.homework', tall: false, title: 'Did you give a between-session assignment?', help: 'Specific and measurable works best.',
    chips: uniq([...selectedInts().map(i => HOMEWORK[i.id]).filter(Boolean), 'Practice the skill from today at least 3 times this week.', 'No assignment given this session.']) });
  add({ id: 'coord', sec: 'plan', type: 'text', path: 'plan.coord', tall: false, title: 'Any coordination of care or referrals?', help: 'Optional.',
    chips: ['Coordinated with prescriber (release on file).', 'Consulted with clinical supervisor.', 'Provided referral to ', 'No coordination of care needed this session.'] });
  add({ id: 'change', sec: 'plan', type: 'text', path: 'plan.change', tall: false, title: 'Any changes to the treatment plan?', help: 'Optional.', chips: ['No changes to the treatment plan.', 'Treatment plan updated: ', 'Treatment plan review due '] });

  add({ id: 'done', sec: 'plan', type: 'done', title: 'Your note is ready' });
  return Q;
}

function cptHint() {
  const dur = duration(), sug = suggestedCpt();
  if (dur == null) return 'Enter start and end times and a time-based psychotherapy code is chosen for you.';
  return `Session length ${dur} min${sug ? `, which matches ${sug}` : ''}.`;
}

function textQ(q, multi) {
  const v = getPath(S, q.path) || '';
  const ctl = multi
    ? `<textarea class="${q.tall === false ? '' : 'tall'}" data-b="${q.path}" aria-label="${esc(q.title)}" placeholder="${esc(q.ph || '')}">${esc(v)}</textarea>`
    : `<input type="text" data-b="${q.path}" aria-label="${esc(q.title)}" value="${esc(v)}" placeholder="${esc(q.ph || '')}" autocomplete="off">`;
  const ch = q.chips && q.chips.length
    ? `<div class="chips qchips">${q.chips.map(t => `<button type="button" class="chip" data-action="starter" data-target="${q.path}" data-text="${esc(t)}"${q.sep ? ` data-sep="${esc(q.sep)}"` : ''}>${esc(t.trim())}</button>`).join('')}</div>`
    : '';
  return ctl + ch;
}

const QTYPES = {
  session: () => `<div class="grid2">${field('Client ID / initials <span class="hint">(no full names)</span>', 'session.clientId', { ph: 'e.g., JD-0412' })}${field('Session #', 'session.sessionNum', { type: 'number' })}</div>
    <div class="grid3">${field('Date', 'session.date', { type: 'date' })}${field('Start time', 'session.start', { type: 'time' })}${field('End time', 'session.end', { type: 'time' })}</div>
    ${field('Service (CPT)', 'session.cpt', { type: 'select', options: CPT_CODES.map(c => [c[0], `${c[0]} – ${c[1]}`]) })}
    <p class="hint" id="cptHint" style="margin:-8px 0 14px">${esc(cptHint())}</p>
    <div class="grid2">${field('Format', 'session.modality', { type: 'select', options: MODALITIES })}${field('Participants', 'session.participants', { type: 'select', options: PARTICIPANTS })}</div>
    ${field('Your name & credentials <span class="hint">(optional)</span>', 'session.practitioner', { ph: 'e.g., A. Rivera, LCSW' })}`,
  fields: q => `<div class="${q.grid || ''}">${q.fields.map(([l, p, o]) => field(l, p, o || {})).join('')}</div>`,
  single: q => {
    const v = getPath(S, q.path);
    return `<div class="opts" role="radiogroup" aria-label="${esc(q.title)}">${q.options.map((o, k) => `<button type="button" class="opt" role="radio" aria-checked="${o[0] === v}" data-action="q-pick" data-path="${q.path}" data-val="${esc(o[0])}" data-n="${k + 1}"${q.stay ? ' data-stay' : ''}><span class="key" aria-hidden="true">${k < 9 ? k + 1 : ''}</span><span>${esc(o[1])}${o[2] ? ` <span class="tag">${esc(o[2])}</span>` : ''}</span></button>`).join('')}</div>`;
  },
  multi: q => chips(q.path, q.options, getPath(S, q.path)),
  text: q => textQ(q, true),
  line: q => textQ(q, false),
  dx: () => `<input type="search" id="dxSearch" aria-label="Search diagnoses" placeholder="Search by name, code, or category (e.g., depress, F43, OCD)" autocomplete="off">
    <div class="dx-results" id="dxResults" role="listbox" aria-label="Diagnosis results"></div>
    <details class="guide"><summary>Add a diagnosis not in the list</summary><div class="gbody"><div class="grid2">
      <div class="field"><label for="cdxCode">ICD-10-CM code</label><input id="cdxCode" type="text" placeholder="e.g., F43.9"></div>
      <div class="field"><label for="cdxName">Diagnosis name</label><input id="cdxName" type="text" placeholder="Name"></div></div>
      <button class="btn small" data-action="add-custom">Add diagnosis</button></div></details>
    <div id="dxCards">${S.dx.map((d, i) => dxCard(d, i)).join('')}</div>`,
  sx: q => {
    const d = S.dx[q.idx];
    return `<div class="sxq">${DXMAP[d.id].sx.map((txt, k) => {
      const v = (d.sx || {})[k] || '';
      return `<div class="sxq-row"><span class="sxq-label" id="sxq_${k}">${esc(txt)}</span><div class="seg" role="group" aria-labelledby="sxq_${k}">${SX_BUTTONS.map(([val, lab]) => `<button type="button" class="segbtn s-${val}" data-action="q-sx" data-idx="${q.idx}" data-k="${k}" data-val="${val}" aria-pressed="${v === val}">${lab}</button>`).join('')}</div></div>`;
    }).join('')}</div>`;
  },
  mse: () => `<div class="grid2">${MSE_FIELDS.map(f => `<div class="field"><label for="mse_${f.key}">${f.label}</label><select id="mse_${f.key}" data-b="mse.${f.key}"><option value="">— not assessed —</option>${f.opts.map(o => `<option${o === S.mse[f.key] ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select></div>`).join('')}</div>
    <button class="btn" data-action="mse-wnl">Fill the rest as within normal limits</button>`,
  measures: () => measuresUI(),
  goals: () => {
    const sug = uniq(selectedRefs().flatMap(r => r.g));
    const have = new Set(S.goals.map(g => trim(g.text)));
    return S.goals.map((g, i) => `<div class="goal"><div class="gh"><strong>Goal ${i + 1}</strong><button class="btn small danger" data-action="rm-goal" data-idx="${i}" aria-label="Remove goal ${i + 1}">Remove</button></div>
        <textarea data-b="goals.${i}.text" aria-label="Goal ${i + 1}" placeholder="Measurable goal from the treatment plan">${esc(g.text)}</textarea></div>`).join('') +
      `<button class="btn small" data-action="add-goal" data-text="">+ Add goal</button>` +
      (sug.length ? `<h3 style="margin-top:18px">Suggested goals for this diagnosis</h3><p class="hint">Edit the [brackets] after adding.</p><div class="suggest">${sug.map(t => `<button class="btn small" data-action="add-goal" data-text="${esc(t)}" ${have.has(t) ? 'disabled' : ''}>+ ${esc(t)}</button>`).join('')}</div>` : '');
  },
  ints: () => {
    const rec = recommendedInts();
    const gen = GENERAL_INTERVENTIONS.filter(id => !rec.includes(id));
    const chip = id => `<button type="button" class="chip" data-action="q-int" data-id="${id}" aria-pressed="${!!(S.int[id] && S.int[id].on)}">${esc(INTERVENTIONS[id][0])}</button>`;
    return (rec.length ? `<h3>Evidence-based for the selected diagnosis</h3><div class="chips">${rec.map(chip).join('')}</div>` : '') +
      `<h3 style="margin-top:16px">General</h3><div class="chips">${gen.map(chip).join('')}</div>` +
      `<div style="margin-top:16px">${field('Anything else? <span class="hint">(optional)</span>', 'intOther', { ph: 'Other interventions, with specifics' })}</div>`;
  },
  intdetail: q => textQ({ ...q, path: `int.${q.intId}.detail`, ph: INTERVENTIONS[q.intId][1], tall: false }, true),
  goalprog: q => {
    const ints = selectedInts();
    return `<blockquote class="goalq">${esc(S.goals[q.idx].text)}</blockquote>` +
      QTYPES.single({ ...q, path: `goals.${q.idx}.progress`, options: PROGRESS_OPTS.map(o => [o, o]), stay: true }) +
      `<div style="margin-top:14px">${field('Evidence <span class="hint">score change, behavior, frequency</span>', `goals.${q.idx}.comment`, { ph: 'e.g., PHQ-9 18 → 15; walked 3 of 7 days' })}</div>` +
      (ints.length ? `<p class="hint">Which interventions addressed this goal?</p><div class="chips">${ints.map(it => `<button type="button" class="chip" data-action="q-link" data-id="${it.id}" data-idx="${q.idx}" aria-pressed="${String(it.goal) === String(q.idx)}">${esc(it.label)}</button>`).join('')}</div>` : '');
  },
  draft: q => textQ(q, true) + `<div class="qchips"><button class="btn" data-action="q-draft" data-kind="${q.draft}" data-target="${q.path}">✎ Draft from my answers</button></div>
    <p class="hint">The draft only restates what you entered. Review and edit it before using.</p>`,
  done: () => {
    const checks = runChecks();
    const score = scoreOf(checks);
    const issues = checks.filter(c => c.level !== 'ok').sort((a, b) => (a.level === 'bad' ? -1 : 0) - (b.level === 'bad' ? -1 : 0));
    return `<p class="done-score"><strong>${score}%</strong> documentation completeness</p><div class="meter" role="img" aria-label="${score} percent"><i style="width:${score}%"></i></div>
      <div class="pane-actions"><button class="btn primary" data-action="copy">Copy note</button><button class="btn" data-action="download">Download .txt</button><button class="btn" data-action="print">Print</button></div>
      ${issues.length ? `<h3 style="margin-top:16px">Before you sign, consider:</h3>` + issues.map(c => `<div class="chk ${c.level}"><span class="ic" aria-hidden="true">${c.level === 'bad' ? '✕' : '!'}</span><div><div class="t">${esc(c.title)}</div><div class="tip">${esc(c.tip)}</div><button class="linklike jump" data-q="${checkQ(c.id)}">Answer this →</button></div></div>`).join('') : '<p>No documentation gaps found.</p>'}
      <div class="inline-note"><h3 style="margin-top:16px">Your note</h3><div class="note">${esc(buildNote())}</div></div>
      <p class="hint" style="margin-top:14px">Your note is in the Note panel. Change its layout with "Note format" at the top, then paste it into your EHR and review it before signing.</p>`;
  },
};

/* ---------- drafts built only from the clinician's own answers ---------- */
const shortSx = t => lcFirst(t.replace(/\s*\(.*?\)/g, '').replace(/\s*\/.*$/, '').trim());
const shortInt = t => t.replace(/\s*\(.*?\)/g, '').split(' ').map(w => (/^[A-Z0-9-]{2,}$/.test(w) ? w : w.toLowerCase())).join(' ');
function sxGroups() {
  const g = { present: [], improved: [], worsened: [], absent: [] };
  for (const d of S.dx) {
    const ref = DXMAP[d.id];
    if (ref) ref.sx.forEach((t, k) => { const st = d.sx && d.sx[k]; if (g[st]) g[st].push(shortSx(t)); });
  }
  return g;
}
function measureChanges() {
  return S.measures.filter(m => trim(m.name) && trim(m.score)).map(m => {
    const n = trim(m.name), a = parseFloat(m.prev), b = parseFloat(m.score);
    if (isNaN(a) || isNaN(b)) return `${n} score was ${trim(m.score)}`;
    return b < a ? `${n} decreased from ${a} to ${b}` : b > a ? `${n} increased from ${a} to ${b}` : `${n} was unchanged at ${b}`;
  });
}
const primaryDx = () => S.dx.find(d => d.primary) || S.dx[0];

const DRAFTS = {
  impression() {
    const out = [];
    const prim = primaryDx();
    if (prim) out.push(`Client's presentation remains consistent with ${dxName(prim)}${prim.code ? ` (${prim.code})` : ''}.`);
    const g = sxGroups();
    const bits = [];
    if (g.improved.length) bits.push(`improvement in ${joinList(g.improved.slice(0, 3))}`);
    if (g.worsened.length) bits.push(`worsening of ${joinList(g.worsened.slice(0, 3))}`);
    if (g.present.length) bits.push(`ongoing ${joinList(g.present.slice(0, 3))}`);
    if (bits.length) out.push(`Compared with last session, client reports ${joinList(bits)}.`);
    const mc = measureChanges();
    if (mc.length) out.push(`${capFirst(joinList(mc))}.`);
    const ints = selectedInts();
    if (ints.length) out.push(`Session interventions included ${joinList(ints.slice(0, 3).map(i => shortInt(i.label)))}.`);
    const prog = S.goals.filter(x => len(x.text) && x.progress && x.progress !== PROGRESS_OPTS[0]).map(x => x.progress);
    if (prog.length) {
      if (prog.some(p => p === 'Goal met' || p === 'Significant progress')) out.push('Client is making meaningful progress toward treatment goals.');
      else if (prog.some(p => p === 'Moderate progress' || p === 'Minimal progress')) out.push('Client is making gradual progress toward treatment goals.');
      else if (prog.includes('Regression')) out.push('Some regression is noted; the treatment approach will be reviewed.');
      else out.push('Progress toward treatment goals has been limited; the treatment approach will be reviewed.');
    }
    if (S.risk.level) {
      const si = S.risk.si && S.risk.si !== 'none' ? `, with ${lcFirst(lookup(SI_OPTS, S.risk.si)).replace(/,? no plan or intent$/, ' without plan or intent')}` : '';
      out.push(`Acute risk is assessed as ${S.risk.level.toLowerCase()}${si}.`);
    }
    return out.join(' ');
  },
  necessity() {
    const prim = primaryDx();
    const doms = S.func.domains.map(x => x.toLowerCase().replace(' / ', '/'));
    if (!prim && !doms.length) return '';
    const g = sxGroups();
    const active = [...g.worsened, ...g.present].slice(0, 3);
    const out = [`${prim ? `Symptoms of ${dxName(prim)}` : 'Current symptoms'}${active.length ? ` (${joinList(active)})` : ''} ${doms.length ? `continue to impair the client's functioning in ${joinList(doms)}` : 'continue to cause clinically significant distress'}.`];
    if (S.func.rec === 'higher') {
      out.push('Current symptoms and risk exceed what can be safely addressed at this level of care, and referral to a higher level of care is recommended.');
    } else {
      const aims = ['reduce symptom severity', 'restore functioning'];
      if (riskElevated()) aims.push('monitor risk');
      const freq = FREQ_ADJ[S.plan.freq] ? FREQ_ADJ[S.plan.freq] + ' ' : '';
      const nGoals = S.goals.filter(x => len(x.text)).length;
      out.push(`Continued ${freq}outpatient psychotherapy is medically necessary to ${joinList(aims)}${nGoals ? ', consistent with the current treatment plan goals' : ''}.`);
    }
    if (S.func.rec === 'discharge') out.push('Client is approaching discharge criteria; remaining sessions will focus on consolidating gains and relapse prevention.');
    return out.join(' ');
  },
};

/* ---------- interview navigation ---------- */
function curQ() {
  const Q = questions();
  let i = Q.findIndex(q => q.id === qid);
  if (i < 0) i = Math.max(0, Math.min(qIndex, Q.length - 1));
  qIndex = i;
  qid = Q[i].id;
  step = Q[i].sec;
  return { Q, i, q: Q[i] };
}

function renderQuestion() {
  const { Q, i, q } = curQ();
  const n = Q.length;
  const sec = STEPS.find(s => s.id === q.sec).label;
  return `<div class="q" data-qid="${q.id}">
    <div class="qprogress"><span>${q.type === 'done' ? 'Finished' : q.type === 'session' ? 'Getting started' : `Question ${i} of ${n - 2}`} · ${sec}</span><div class="meter"><i style="width:${Math.round(100 * i / (n - 1))}%"></i></div></div>
    <h2 class="qtitle" tabindex="-1">${esc(q.title)}</h2>
    ${q.help ? `<p class="lead">${q.help}</p>` : ''}
    <div class="qbody">${QTYPES[q.type](q)}</div>
    <div class="qnav">${i === 0 ? '' : '<button class="btn" data-q-nav="back">← Back</button>'}<span class="spacer"></span>
      ${q.type === 'done' ? '<button class="btn" data-q="session">Review from the start</button>' : `<button class="btn primary" data-q-nav="next">${q.type === 'session' ? 'Start questions' : i === n - 2 ? 'Finish' : 'Next'} →</button>`}</div>
  </div>`;
}

function focusQuestion() {
  const top = panel.getBoundingClientRect().top;
  if (top < 0 || top > window.innerHeight * 0.6) panel.scrollIntoView({ block: 'start', behavior: 'smooth' });
  const input = $('.qbody input, .qbody textarea', panel);
  const touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;
  (input && !touch ? input : $('.qtitle', panel)).focus({ preventScroll: true });
}

function goQ(id, focus = true) {
  qid = id;
  renderPanel();
  update();
  if (focus) focusQuestion();
}

let advancing = false;
function qMove(delta) {
  const { Q, i } = curQ();
  goQ(Q[Math.max(0, Math.min(Q.length - 1, i + delta))].id);
}

// Which question fixes a given quality-check finding.
function checkQ(id) {
  const Q = questions();
  const first = pred => (Q.find(pred) || {}).id;
  switch (id) {
    case 'id': case 'time': return 'session';
    case 'sx': return first(q => q.type === 'sx') || 'dx';
    case 'report': case 'lang': case 'phi': return 'since';
    case 'mse': return 'mse';
    case 'meas': return 'measures';
    case 'risk': return S.risk.si ? 'hi' : 'si';
    case 'riskAct': return S.risk.actions.some(a => a !== 'No additional action required') && Q.some(q => q.id === 'riskNotes') ? 'riskNotes' : 'actions';
    case 'abuse': return 'actions';
    case 'ints': return first(q => q.type === 'intdetail' && len((S.int[q.intId] || {}).detail) < 15) || 'ints';
    case 'link': case 'prog': return first(q => q.type === 'goalprog') || 'goals';
    case 'resp': return 'response';
    case 'imp': return 'impression';
    case 'func': return 'funcStatement';
    case 'plan': return 'next';
    default: return Q.some(q => q.id === id) ? id : 'dx';
  }
}

function setMode(m) {
  mode = m;
  $$('.modes button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
  if (m === 'interview') {
    const { q } = curQ();
    if (q.sec !== step) { const f = questions().find(x => x.sec === step); if (f) qid = f.id; }
  }
  renderPanel();
  update();
}

/* =====================================================================
 * Rendering – chrome
 * ===================================================================== */
function renderSteps(checks) {
  const byStep = {};
  (checks || []).forEach(c => { (byStep[c.step] = byStep[c.step] || []).push(c); });
  const cur = mode === 'interview' ? curQ().q.sec : step;
  setHTML($('#steps'), STEPS.map((s, i) => {
    const cs = byStep[s.id] || [];
    const done = cs.length && cs.every(c => c.level === 'ok');
    return `<button class="step${done ? ' done' : ''}" data-go="${s.id}"${s.id === cur ? ' aria-current="step"' : ''}><span class="n">${done ? '✓' : i + 1}</span>${s.label}</button>`;
  }).join(''));
}

function renderPanel() {
  panel.innerHTML = mode === 'interview' ? renderQuestion() : VIEWS[step]();
  if ($('#dxResults', panel)) renderDxResults();
}

function renderPreview() {
  const hasContent = S.dx.length || trim(S.subj.since) || trim(S.subj.report) || trim(S.session.clientId);
  const text = buildNote();
  const el = $('#notePreview');
  el.textContent = text;
  if (!hasContent) el.innerHTML = '<span class="empty">Your note builds here as you answer. Start with the session details and diagnosis.</span>';
}

const scoreOf = checks => Math.round(100 * checks.reduce((n, c) => n + { ok: 1, warn: 0.5, bad: 0 }[c.level], 0) / (checks.length || 1));

function renderChecks(checks) {
  const score = scoreOf(checks);
  $('#scoreBadge').textContent = score + '%';
  const groups = [['bad', 'Needs attention'], ['warn', 'Could be stronger'], ['ok', 'Looks good']];
  const icon = { ok: '✓', warn: '!', bad: '✕' };
  setHTML($('#checkResults'), `<p><strong>Documentation completeness: ${score}%</strong></p><div class="meter" role="img" aria-label="${score} percent"><i style="width:${score}%"></i></div>` +
    groups.map(([lvl, title]) => {
      const items = checks.filter(c => c.level === lvl);
      if (!items.length) return '';
      return `<h4 style="margin:14px 0 4px">${title} (${items.length})</h4>` + items.map(c => `<div class="chk ${lvl}"><span class="ic" aria-hidden="true">${icon[lvl]}</span><div><div class="t">${esc(c.title)}</div><div class="tip">${esc(c.tip)}</div>${lvl !== 'ok' ? (mode === 'interview' ? `<button class="linklike jump" data-q="${checkQ(c.id)}">Answer this →</button>` : `<button class="linklike jump" data-go="${c.step}">Go to ${STEPS.find(s => s.id === c.step).label} →</button>`) : ''}</div></div>`).join('');
    }).join('') +
    '<p class="hint" style="margin-top:14px">This checks structure and common audit/best-practice items, not clinical quality. You remain responsible for the accuracy and appropriateness of the record.</p>');
  return score;
}

const TIPS_HTML = `<div class="tips">
<h4>The "golden thread"</h4>
<p>Every note should connect: <strong>diagnosis → symptoms &amp; functional impairment → treatment goal → intervention → client response → plan</strong>. If an auditor can follow that thread in one note, medical necessity is evident.</p>
<h4>Be specific and behavioral</h4>
<div class="ex"><div class="bad-ex"><strong>Instead of:</strong> "Discussed depression. Client did well. Supportive therapy."</div>
<div class="good-ex"><strong>Try:</strong> "Client reported low mood 5 of 7 days and skipped work twice (PHQ-9 = 15, down from 18). Used behavioral activation to schedule three walks; client rated predicted enjoyment 3/10. Client agreed to track mood after each."</div></div>
<h4>Core practices</h4>
<ul>
<li><strong>Use measures.</strong> Repeat a validated scale on a regular schedule and cite the score change.</li>
<li><strong>Document risk reasoning</strong> every time it is assessed: factors, protective factors, level, action.</li>
<li><strong>Use neutral, person-first language.</strong> "Reports" rather than "claims"; "declined" rather than "refused"; "client with alcohol use disorder" rather than "alcoholic."</li>
<li><strong>Write assuming the client will read it.</strong> Under the 21st Century Cures Act, clients often have access to their notes.</li>
<li><strong>Minimum necessary.</strong> Include what supports care and billing. Leave out unneeded third-party details and graphic trauma narrative.</li>
<li><strong>Avoid cloned notes.</strong> Copy-forward text with no session-specific content is a common audit finding.</li>
<li><strong>Be timely.</strong> Complete notes as soon as possible (many payers and employers expect within 24–72 hours).</li>
<li><strong>Never alter a signed note.</strong> Add a dated, signed addendum for corrections.</li>
</ul>
<h4>Progress notes vs. psychotherapy notes (HIPAA)</h4>
<p>Progress notes belong in the record and are accessible to the client and payers. They should contain session start/stop times, modality, diagnosis, symptoms, functional status, treatment plan, interventions, progress, and prognosis. HIPAA "psychotherapy notes" (your private process notes) are kept separately and should not hold this required information.</p>
<h4>Measurable goals (SMART)</h4>
<p>Specific, Measurable, Achievable, Relevant, Time-bound. Example: "Reduce PHQ-9 from 18 to under 10 within 12 weeks."</p>
</div>`;

function update(opts = {}) {
  const checks = runChecks();
  renderChecks(checks);
  renderSteps(checks);
  renderPreview();
  save();
  return checks;
}

function setStep(id, focus = true) {
  step = id;
  if (mode === 'interview') {
    const q = questions().find(x => x.sec === id);
    if (q) { goQ(q.id, focus); return; }
  }
  renderPanel();
  update();
  if (focus) { panel.scrollIntoView({ block: 'start', behavior: 'smooth' }); panel.focus({ preventScroll: true }); }
}

/* =====================================================================
 * Events
 * ===================================================================== */
function onField(e) {
  const t = e.target;
  const path = t.dataset && t.dataset.b;
  if (!path) return;
  // Text-like controls are fully handled by 'input'; skipping the trailing 'change' on blur avoids redundant work.
  if (e.type === 'change' && (t.tagName === 'TEXTAREA' || (t.tagName === 'INPUT' && t.type !== 'checkbox' && t.type !== 'radio'))) return;
  const val = t.type === 'checkbox' ? t.checked : t.value;
  setPath(S, path, val);

  if (path === 'session.start' || path === 'session.end') {
    const sug = suggestedCpt();
    if (sug && sug !== S.session.cpt && CPT_RULES[S.session.cpt] && S.session.cpt !== '90839') {
      S.session.cpt = sug;
      const sel = $('[data-b="session.cpt"]', panel);
      if (sel) sel.value = sug;
    }
    const h = $('#cptHint', panel);
    if (h) h.textContent = cptHint();
  }
  if (t.matches('[data-sx]')) t.closest('.sx-row').classList.toggle('on', !!val);
  if (t.type === 'checkbox' && /^int\./.test(path)) {
    const item = t.closest('.int-item');
    item.classList.toggle('on', t.checked);
    $('.more', item).hidden = !t.checked;
  }
  if (path === 'risk.si' || path === 'risk.hi') {
    $('#riskBox').classList.toggle('alert', (S.risk.si && S.risk.si !== 'none') || (S.risk.hi && S.risk.hi !== 'none'));
  }
  update();
}
panel.addEventListener('input', onField);
panel.addEventListener('change', onField);

panel.addEventListener('input', e => { if (e.target.id === 'dxSearch') renderDxResults(); });

function addDx(id) {
  if (S.dx.some(d => d.id === id)) return;
  const ref = DXMAP[id];
  S.dx.push({ id, code: Array.isArray(ref.code) ? '' : ref.code, codeLabel: '', primary: !S.dx.length, sx: {} });
}

function handleAction(el) {
  const a = el.dataset.action;
  const idx = +el.dataset.idx;
  switch (a) {
    case 'add-dx': addDx(el.dataset.id); renderPanel(); toast('Diagnosis added'); break;
    case 'rm-dx': {
      const wasPrimary = S.dx[idx].primary;
      S.dx.splice(idx, 1);
      if (wasPrimary && S.dx[0]) S.dx[0].primary = true;
      renderPanel(); break;
    }
    case 'set-primary': S.dx.forEach((d, i) => { d.primary = i === idx; }); break;
    case 'add-custom': {
      const name = trim($('#cdxName').value), code = trim($('#cdxCode').value);
      if (!name) { toast('Enter a diagnosis name'); return; }
      S.dx.push({ id: 'custom_' + Date.now(), custom: true, name, code, primary: !S.dx.length, sx: {} });
      renderPanel(); break;
    }
    case 'add-measure': {
      S.measures.push({ name: el.dataset.name || '', score: '', prev: '' });
      renderPanel();
      if (!el.dataset.name) { const ins = $$('#measureList input[data-b$=".name"]'); ins[ins.length - 1].focus(); }
      break;
    }
    case 'rm-measure': S.measures.splice(idx, 1); renderPanel(); break;
    case 'add-goal': {
      S.goals.push({ text: el.dataset.text || '', progress: '', comment: '' });
      renderPanel();
      if (!el.dataset.text) { const ins = $$('.goal textarea'); ins[ins.length - 1].focus(); }
      break;
    }
    case 'rm-goal': {
      S.goals.splice(idx, 1);
      Object.values(S.int).forEach(it => {
        if (it && it.goal !== '' && it.goal != null) {
          if (+it.goal === idx) it.goal = '';
          else if (+it.goal > idx) it.goal = String(+it.goal - 1);
        }
      });
      renderPanel(); break;
    }
    case 'starter': {
      const ta = $(`[data-b="${el.dataset.target}"]`);
      const cur = ta.value;
      const sep = el.dataset.sep;
      ta.value = !trim(cur) ? el.dataset.text : sep ? cur.replace(/[\s;,]+$/, '') + sep + el.dataset.text : cur + (/\s$/.test(cur) ? '' : ' ') + el.dataset.text;
      setPath(S, el.dataset.target, ta.value);
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
      break;
    }
    case 'q-pick': {
      setPath(S, el.dataset.path, el.dataset.val);
      $$('.opt', el.parentNode).forEach(b => b.setAttribute('aria-checked', String(b === el)));
      update();
      if (!el.hasAttribute('data-stay') && !advancing) {
        advancing = true;
        setTimeout(() => { advancing = false; qMove(1); }, 180);
      }
      return;
    }
    case 'q-sx': {
      const d = S.dx[idx];
      d.sx = d.sx || {};
      const v = d.sx[el.dataset.k] === el.dataset.val ? '' : el.dataset.val;
      d.sx[el.dataset.k] = v;
      $$('.segbtn', el.parentNode).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.val === v)));
      break;
    }
    case 'q-int': {
      const it = S.int[el.dataset.id] = S.int[el.dataset.id] || {};
      it.on = !it.on;
      el.setAttribute('aria-pressed', String(it.on));
      break;
    }
    case 'q-link': {
      const it = S.int[el.dataset.id];
      const g = String(idx);
      it.goal = String(it.goal) === g ? '' : g;
      el.setAttribute('aria-pressed', String(it.goal === g));
      break;
    }
    case 'mse-wnl':
      for (const [k, v] of Object.entries(MSE_WNL)) if (!S.mse[k]) S.mse[k] = v;
      renderPanel();
      break;
    case 'q-draft': {
      const text = DRAFTS[el.dataset.kind]();
      if (!text) { toast('Answer a few more questions first'); return; }
      const ta = $(`[data-b="${el.dataset.target}"]`);
      if (trim(ta.value) && trim(ta.value) !== text && !confirm('Replace your current text with a new draft?')) return;
      ta.value = text;
      setPath(S, el.dataset.target, text);
      ta.focus();
      break;
    }
    case 'copy': copyNote(); return;
    case 'download': downloadNote(); return;
    case 'print': window.print(); return;
    default: return;
  }
  update();
}

panel.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.action === 'set-code') {
    const [code, label] = t.value.split('|');
    const d = S.dx[+t.dataset.idx];
    d.code = code || '';
    d.codeLabel = label || '';
    update();
  } else if (t.dataset.action === 'set-primary') handleAction(t);
});

document.addEventListener('click', e => {
  const t = e.target.closest('button, [data-go]');
  if (!t) return;
  if (t.hasAttribute('disabled')) return;

  if (t.dataset.chip) {
    const arr = getPath(S, t.dataset.chip);
    const v = t.dataset.val;
    const i = arr.indexOf(v);
    if (i >= 0) arr.splice(i, 1); else arr.push(v);
    t.setAttribute('aria-pressed', String(i < 0));
    update();
    return;
  }
  if (t.dataset.qNav) { qMove(t.dataset.qNav === 'back' ? -1 : 1); return; }
  if (t.dataset.q) { if (mode !== 'interview') setMode('interview'); goQ(t.dataset.q); return; }
  if (t.dataset.mode) { setMode(t.dataset.mode); return; }
  if (t.dataset.go) { setStep(t.dataset.go); return; }
  if (t.hasAttribute('data-go-check')) { selectPane('check'); $('.side').scrollIntoView({ behavior: 'smooth' }); return; }
  if (t.dataset.action && t.dataset.action !== 'set-primary') handleAction(t);
});

function selectPane(name) {
  $$('.tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.pane === name)));
  $$('.pane').forEach(p => { p.hidden = p.id !== 'pane-' + name; });
}
$$('.tabs button').forEach(b => b.addEventListener('click', () => selectPane(b.dataset.pane)));

$('#format').value = S.format;
$('#format').addEventListener('change', e => {
  S.format = e.target.value;
  if (mode === 'interview' && curQ().q.type === 'done') renderPanel();
  update();
});

// Interview shortcuts: number keys pick an answer; Enter in a one-line field moves on.
document.addEventListener('keydown', e => {
  if (mode !== 'interview' || e.altKey || e.ctrlKey || e.metaKey || $('dialog[open]')) return;
  const t = e.target;
  if (/^[1-9]$/.test(e.key) && !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) {
    const b = $(`.opt[data-n="${e.key}"]`, panel);
    if (b) { e.preventDefault(); b.click(); }
  } else if (e.key === 'Enter' && t.tagName === 'INPUT' && t.type !== 'search' && panel.contains(t)) {
    e.preventDefault();
    qMove(1);
  }
});

async function copyNote() {
  const text = buildNote();
  try { await navigator.clipboard.writeText(text); toast('Note copied to clipboard'); }
  catch (_) {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast('Note copied to clipboard'); } catch (__) { toast('Copy failed – select the text manually'); }
    ta.remove();
  }
}
function downloadNote() {
  const safe = s => (s || '').replace(/[^\w-]+/g, '_').slice(0, 30) || 'client';
  const blob = new Blob([buildNote()], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `note_${safe(S.session.clientId)}_${S.session.date || 'undated'}.txt`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
$('#btnCopy').addEventListener('click', copyNote);
$('#btnDownload').addEventListener('click', downloadNote);
$('#btnPrint').addEventListener('click', () => window.print());

$('#btnClear').addEventListener('click', () => {
  if (!confirm('Erase the current note and everything saved in this browser? This cannot be undone.')) return;
  try { localStorage.removeItem(KEY); } catch (_) { /* ignore */ }
  const fmt = S.format;
  S = blank(); S.format = fmt;
  qid = null; qIndex = 0;
  setStep('session', false);
  toast('Cleared');
});

$('#btnNext').addEventListener('click', () => {
  if (!confirm('Start the next session? Client, diagnoses, goals, and measures carry over; session content, risk, interventions, and plan are cleared.')) return;
  const old = S, n = blank();
  n.format = old.format;
  Object.assign(n.session, { clientId: old.session.clientId, practitioner: old.session.practitioner, cpt: old.session.cpt, modality: old.session.modality, participants: old.session.participants });
  const num = parseInt(old.session.sessionNum, 10);
  n.session.sessionNum = Number.isFinite(num) ? String(num + 1) : '';
  n.dx = old.dx.map(d => ({ ...d, sx: {} }));
  n.goals = old.goals.map(g => ({ text: g.text, progress: '', comment: '' }));
  n.measures = old.measures.filter(m => trim(m.name)).map(m => ({ name: m.name, score: '', prev: trim(m.score) || m.prev }));
  S = n;
  setStep('session', false);
  toast('New session started');
});

const dlg = $('#aboutDialog');
$('#btnAbout').addEventListener('click', () => (dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '')));

$('#tipsContent').innerHTML = TIPS_HTML;

/* ---------- init ---------- */
setMode(mode);
})();
