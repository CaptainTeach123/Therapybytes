/* TherapyBytes clinical reference data.
 *
 * IMPORTANT: Symptom lists below are brief PARAPHRASED summaries written for
 * documentation prompting. They are NOT the DSM-5-TR diagnostic criteria and
 * are not a substitute for them. Practitioners must diagnose from the DSM-5-TR
 * itself. ICD-10-CM codes should be verified against the current code set and
 * payer requirements before billing.
 */

/* ---------- Intervention library ---------- */
const INTERVENTIONS = {
  cbt:   ['Cognitive Behavioral Therapy (cognitive restructuring)', 'e.g., completed thought record on ___; identified distortions (___) and generated balanced alternative thoughts'],
  ba:    ['Behavioral Activation', 'e.g., reviewed activity log; scheduled ___ pleasure/mastery activities with specific days/times'],
  act:   ['Acceptance and Commitment Therapy', 'e.g., values clarification in domain ___; cognitive defusion exercise (___); committed-action step'],
  dbt:   ['DBT skills training', 'e.g., taught/practiced distress tolerance (___), emotion regulation (___), interpersonal effectiveness (___); reviewed diary card'],
  mi:    ['Motivational Interviewing', 'e.g., open questions/reflections to explore ambivalence about ___; elicited change talk; rated readiness __/10'],
  exp:   ['Exposure therapy (in vivo / imaginal / interoceptive)', 'e.g., exposure to ___ with SUDS __ → __; expectancy violated: ___'],
  erp:   ['Exposure and Response Prevention (ERP)', 'e.g., hierarchy item ___ (SUDS __); response prevented: ___; no ritual performed for __ min'],
  pe:    ['Prolonged Exposure (PE)', 'e.g., imaginal exposure to ___ (SUDS peak __ → end __); processed hot spots; in vivo assignment ___'],
  cpt:   ['Cognitive Processing Therapy (CPT)', 'e.g., worked on stuck point "___" using Challenging Questions / worksheet ___'],
  emdr:  ['EMDR', 'e.g., phase __; target memory ___; SUD __ → __; VOC __ → __'],
  tfcbt: ['Trauma-Focused CBT (TF-CBT)', 'e.g., PRACTICE component ___ (psychoeducation / relaxation / affect modulation / cognitive coping / narrative / in vivo / conjoint)'],
  ipt:   ['Interpersonal Therapy (IPT)', 'e.g., focus area (grief / role dispute / role transition / interpersonal deficits): ___; communication analysis of ___'],
  cbasp: ['CBASP (Cognitive Behavioral Analysis System of Psychotherapy)', 'e.g., Situational Analysis of ___; interpersonal discrimination exercise'],
  psyedu:['Psychoeducation', 'e.g., explained ___ (symptom cycle, rationale for treatment, relapse signs) using ___; checked understanding by ___'],
  relax: ['Relaxation training / diaphragmatic breathing / PMR', 'e.g., guided diaphragmatic breathing x __ min; client rated tension __ → __'],
  mind:  ['Mindfulness-based skills', 'e.g., practiced ___ (breath focus / body scan / observing thoughts) for __ min; reviewed home practice'],
  ps:    ['Problem-Solving Therapy', 'e.g., defined problem ___; brainstormed options; chose and planned ___'],
  safety:['Safety planning (e.g., Stanley-Brown)', 'e.g., reviewed/updated warning signs, coping steps, contacts, means safety, and crisis numbers'],
  crisis:['Crisis intervention', 'e.g., assessed immediate risk; de-escalated using ___; disposition: ___'],
  cbti:  ['CBT for Insomnia (CBT-I)', 'e.g., reviewed sleep diary (TIB __, TST __); adjusted sleep window to ___; stimulus control instructions'],
  sst:   ['Social skills training', 'e.g., role-played ___; coached on ___; assigned in-vivo practice with ___'],
  pmt:   ['Parent Management Training / parent coaching', 'e.g., taught ___ (praise, ignoring, clear commands, consequences); rehearsed with parent; reviewed home data'],
  fbt:   ['Family-Based Treatment', 'e.g., session phase __; parent-led meal support; reviewed intake and weight/vitals from medical provider'],
  cbte:  ['Enhanced CBT for eating disorders (CBT-E)', 'e.g., reviewed food record; regular-eating plan; addressed ___ (overvaluation of shape/weight, dietary restraint)'],
  hrt:   ['Habit Reversal Training / ComB', 'e.g., awareness training, competing response (___), stimulus control for ___ trigger'],
  cm:    ['Contingency Management', 'e.g., reinforced verified abstinence (___); schedule/reinforcer adjusted to ___'],
  rp:    ['Relapse prevention', 'e.g., identified high-risk situations (___); rehearsed coping responses; updated relapse plan'],
  sup:   ['Supportive therapy / validation', 'e.g., reflective listening and validation regarding ___ to strengthen alliance and reduce distress'],
  grief: ['Grief-focused therapy', 'e.g., addressed ___ (imaginal revisiting, restoration goals, continuing bonds); client-rated yearning __/10'],
  couples:['Couples therapy (EFT / Gottman / IBCT)', 'e.g., identified negative cycle (___); practiced softened startup / emotional-bid turning toward; assigned ___'],
  ipsrt: ['Interpersonal & Social Rhythm Therapy', 'e.g., reviewed Social Rhythm Metric; stabilized ___ anchor (wake time / meals / activity)'],
  cbtp:  ['CBT for psychosis', 'e.g., collaboratively examined appraisal of ___ (voices / belief); behavioral experiment ___'],
  famedu:['Family psychoeducation', 'e.g., reviewed illness model, early warning signs, and communication strategies with ___'],
  mbt:   ['Mentalization-Based Treatment', 'e.g., slowed down interaction ___; explored mental states of self/other; marked/mirrored affect'],
  schema:['Schema Therapy', 'e.g., identified mode (___); chair work / imagery rescripting targeting schema ___'],
  tfp:   ['Transference-Focused Psychotherapy', 'e.g., explored ___ dyad as enacted in session; clarified, confronted, interpreted ___'],
  orgskills:['Organization / time-management skills training', 'e.g., built planner/task system for ___; broke ___ into steps; set reminders'],
  asd:   ['Structured skills & supports (visual supports, social-communication coaching)', 'e.g., built visual schedule for ___; practiced skill ___ with explicit steps and feedback'],
  selfmon:['Self-monitoring / symptom tracking', 'e.g., reviewed daily log of ___; identified patterns (triggers, times, consequences)'],
  ground:['Grounding / stabilization skills', 'e.g., practiced 5-4-3-2-1 / orienting / paced breathing; SUDS __ → __'],
  iu:    ['Worry exposure / intolerance-of-uncertainty work', 'e.g., worry-time scheduling; exposure to uncertainty ___; behavioral experiment on prediction ___'],
  hw:    ['Homework review', 'e.g., reviewed ___ assignment: completed / partially completed / not completed; barriers: ___'],
  meas:  ['Standardized measure administered / reviewed', 'e.g., administered ___; score __ (prior __); discussed change with client'],
  coord: ['Care coordination / consultation', 'e.g., contacted ___ (PCP / prescriber / school / program) regarding ___ with signed release on file'],
  assess:['Clinical assessment / diagnostic interview', 'e.g., assessed ___ (history, symptom onset/course, functional impact, risk)'],
  txplan:['Treatment planning / goal review', 'e.g., reviewed and updated goals/objectives collaboratively; client agreed to ___'],
};

const GENERAL_INTERVENTIONS = ['sup', 'psyedu', 'hw', 'meas', 'safety', 'crisis', 'coord', 'assess', 'txplan', 'mind', 'relax', 'ps', 'selfmon'];

/* ---------- Shared symptom sets ---------- */
const SUD_SX = [
  'Using more or for longer than intended',
  'Persistent desire / unsuccessful efforts to cut down',
  'Much time spent obtaining, using, or recovering',
  'Cravings or strong urges to use',
  'Failure to meet role obligations (work, school, home)',
  'Continued use despite social / interpersonal problems',
  'Important activities given up or reduced',
  'Use in physically hazardous situations',
  'Continued use despite physical or psychological problems',
  'Tolerance',
  'Withdrawal',
];

/* ---------- Diagnosis catalog ----------
 * Fields: id, cat, name, code (string or [[label, code], ...]),
 * sx (symptom prompts), i (intervention ids), m (measures), g (goal templates),
 * r (risk considerations), t (documentation tips), d (rule-outs / differentials)
 */
const DX = [];
function dx(id, cat, name, code, o) {
  DX.push({
    id, cat, name, code,
    sx: o.sx || [],
    i: (o.i || '').split(' ').filter(Boolean),
    m: (o.m || '').split('|').filter(Boolean),
    g: o.g || [],
    r: o.r || '',
    t: o.t || '',
    d: o.d || '',
  });
}

const MDD_SX = [
  'Depressed or irritable mood most of the day',
  'Markedly diminished interest or pleasure (anhedonia)',
  'Appetite or weight change',
  'Insomnia or hypersomnia',
  'Psychomotor agitation or slowing',
  'Fatigue or loss of energy',
  'Worthlessness or excessive guilt',
  'Difficulty concentrating or making decisions',
  'Recurrent thoughts of death / suicidal ideation',
];
const MDD_O = {
  sx: MDD_SX,
  i: 'ba cbt ipt act ps mind safety',
  m: 'PHQ-9|BDI-II|QIDS-SR|C-SSRS',
  g: [
    'Client will reduce PHQ-9 from [baseline] to below 10 within [12] weeks.',
    'Client will complete at least [3] scheduled valued/pleasurable activities per week.',
    'Client will identify and reframe negative automatic thoughts using a thought record [4] of [7] days.',
    'Client will report sleep of 7+ hours on [5] of 7 nights.',
  ],
  r: 'Screen for suicidal ideation every session. Risk is higher with hopelessness, recent loss, prior attempts, comorbid substance use, bipolar spectrum features, and early in treatment or after hospital discharge. Screen for past manic/hypomanic episodes.',
  t: 'Anchor progress to a repeated measure (e.g., PHQ-9 each session or every 2–4 weeks). Link interventions (e.g., behavioral activation) to functional targets, not just mood. Note psychotic features, severity, and episode (single vs. recurrent) so the code is supported.',
  d: 'Bipolar disorders, persistent depressive disorder, adjustment disorder, prolonged grief, substance/medication-induced or medical causes (e.g., thyroid).',
};
dx('mdd1', 'Depressive', 'Major Depressive Disorder, Single Episode',
  [['Mild', 'F32.0'], ['Moderate', 'F32.1'], ['Severe, without psychotic features', 'F32.2'], ['Severe, with psychotic features', 'F32.3'], ['In partial remission', 'F32.4'], ['In full remission', 'F32.5'], ['Unspecified', 'F32.A']], MDD_O);
dx('mdd2', 'Depressive', 'Major Depressive Disorder, Recurrent Episode',
  [['Mild', 'F33.0'], ['Moderate', 'F33.1'], ['Severe, without psychotic features', 'F33.2'], ['Severe, with psychotic features', 'F33.3'], ['In partial remission', 'F33.41'], ['In full remission', 'F33.42'], ['Unspecified', 'F33.9']], MDD_O);
dx('pdd', 'Depressive', 'Persistent Depressive Disorder (Dysthymia)', 'F34.1', {
  sx: ['Depressed mood more days than not (chronic)', 'Poor appetite or overeating', 'Insomnia or hypersomnia', 'Low energy or fatigue', 'Low self-esteem', 'Poor concentration or indecisiveness', 'Hopelessness'],
  i: 'cbasp cbt ba ipt act mind safety',
  m: 'PHQ-9|BDI-II|QIDS-SR|C-SSRS',
  g: ['Client will reduce PHQ-9 from [baseline] to below 10 within [16] weeks.', 'Client will identify [3] interpersonal patterns that maintain low mood and practice an alternative response [weekly].', 'Client will engage in [3] valued activities per week despite low motivation.'],
  r: 'Chronicity and hopelessness raise risk even when symptoms look "mild." Screen for SI regularly and watch for superimposed major depressive episodes ("double depression").',
  t: 'Document duration of symptoms (2+ years adults; 1+ year youth) and any superimposed episodes. Chronic conditions need realistic, incremental goals.',
  d: 'Major depressive disorder, bipolar spectrum, substance/medical causes, personality disorders.',
});
dx('dmdd', 'Depressive', 'Disruptive Mood Dysregulation Disorder', 'F34.81', {
  sx: ['Severe recurrent temper outbursts out of proportion to situation', 'Outbursts inconsistent with developmental level', 'Persistently irritable or angry mood between outbursts', 'Symptoms present in multiple settings (home, school, peers)'],
  i: 'pmt cbt dbt psyedu coord',
  m: 'Affective Reactivity Index (ARI)|CDI-2|Vanderbilt|Parent-reported outburst log',
  g: ['Client/caregivers will reduce outbursts from [baseline]/week to [≤ target]/week within [12] weeks.', 'Client will use a learned calming strategy in [3] of [5] escalation moments (per caregiver log).', 'Caregivers will use the agreed antecedent/consequence plan consistently [≥ 5 days/week].'],
  r: 'Assess aggression toward others/property, safety at home and school, and self-harm or SI in irritable youth.',
  t: 'Record outburst frequency, duration, triggers, and settings. Document caregiver participation and school coordination (with consent). Diagnosis applies to ages ~6–18 with onset before 10.',
  d: 'Oppositional defiant disorder, bipolar disorder, ADHD, autism spectrum disorder, anxiety, trauma exposure.',
});
dx('pmdd', 'Depressive', 'Premenstrual Dysphoric Disorder', 'N94.3', {
  sx: ['Marked mood swings / sensitivity to rejection', 'Marked irritability or anger', 'Depressed mood or hopelessness', 'Marked anxiety or feeling keyed up', 'Decreased interest in usual activities', 'Concentration difficulty', 'Fatigue / low energy', 'Appetite change or cravings', 'Sleep change', 'Feeling overwhelmed; physical symptoms (breast tenderness, bloating)'],
  i: 'cbt selfmon mind relax psyedu coord',
  m: 'Daily Record of Severity of Problems (DRSP)|PHQ-9|GAD-7',
  g: ['Client will track symptoms daily across [2] cycles to confirm timing pattern.', 'Client will use [chosen coping plan] during luteal phase on [≥ 80%] of symptomatic days.'],
  r: 'Suicidal ideation can cluster in the premenstrual window; ask about timing of SI. Coordinate with the medical provider for medical management.',
  t: 'Diagnosis requires prospective daily ratings across at least two symptomatic cycles. Document the tracking method and cycle timing.',
  d: 'Premenstrual exacerbation of another disorder (MDD, bipolar, anxiety), medical or hormonal conditions.',
});

dx('bp1', 'Bipolar', 'Bipolar I Disorder',
  [['Current episode manic, mild', 'F31.11'], ['Current episode manic, moderate', 'F31.12'], ['Current episode manic, severe', 'F31.13'], ['Current episode manic, with psychotic features', 'F31.2'], ['Current episode hypomanic', 'F31.0'], ['Current episode depressed, mild', 'F31.31'], ['Current episode depressed, moderate', 'F31.32'], ['Current episode depressed, severe w/o psychotic features', 'F31.4'], ['Current episode depressed, with psychotic features', 'F31.5'], ['In partial remission, most recent episode manic', 'F31.73'], ['In full remission, most recent episode manic', 'F31.74'], ['In partial remission, most recent episode depressed', 'F31.75'], ['In full remission, most recent episode depressed', 'F31.76'], ['Unspecified', 'F31.9']], {
  sx: ['Elevated, expansive, or irritable mood', 'Inflated self-esteem or grandiosity', 'Decreased need for sleep', 'Pressured speech / more talkative', 'Racing thoughts or flight of ideas', 'Distractibility', 'Increased goal-directed activity or agitation', 'Risky behavior (spending, sexual, driving)', 'Depressive symptoms (low mood, anhedonia, fatigue)', 'Psychotic symptoms (delusions / hallucinations)'],
  i: 'psyedu ipsrt cbt famedu selfmon safety coord',
  m: 'ASRM|YMRS (clinician)|PHQ-9|MDQ (screening only)|C-SSRS',
  g: ['Client will maintain a regular sleep/wake schedule (±1 hr) on [5] of 7 days.', 'Client will identify [3] personal early warning signs and review the relapse-prevention plan with [support person].', 'Client will attend [all] prescriber appointments and report medication adherence barriers.'],
  r: 'High lifetime suicide risk, especially in depressive and mixed states. Assess mania-related risk (impulsivity, finances, driving, aggression), sleep loss, substance use, and need for higher level of care.',
  t: 'Document current episode polarity and severity (this selects the code), sleep/rhythm data, medication adherence, and prescriber coordination. Record early-warning-sign review.',
  d: 'Bipolar II, cyclothymia, schizoaffective disorder, substance/medication-induced mania, ADHD, borderline personality disorder.',
});
dx('bp2', 'Bipolar', 'Bipolar II Disorder', 'F31.81', {
  sx: ['Hypomanic periods (elevated/irritable mood with increased energy)', 'Decreased need for sleep', 'Racing thoughts / talkativeness', 'Increased goal-directed activity', 'Major depressive episode symptoms (low mood, anhedonia)', 'Impulsive or risky behavior', 'Mood episodes disrupting work/relationships'],
  i: 'psyedu ipsrt cbt famedu selfmon safety coord',
  m: 'PHQ-9|ASRM|MDQ (screening only)|C-SSRS',
  g: ['Client will keep a daily mood and sleep chart and bring it to [weekly] sessions.', 'Client will reduce depressive symptoms (PHQ-9 from [baseline] to < 10) within [12] weeks.', 'Client will identify [3] hypomania warning signs and a plan for each.'],
  r: 'Depressive phases dominate and carry significant suicide risk. Screen every session. Watch for antidepressant-related activation and mixed features.',
  t: 'Document the history of hypomanic episodes (duration, observable change) and how current depression is being managed alongside a prescriber.',
  d: 'MDD, bipolar I, borderline personality disorder, ADHD, cyclothymia.',
});
dx('cyc', 'Bipolar', 'Cyclothymic Disorder', 'F34.0', {
  sx: ['Numerous periods of hypomanic-type symptoms', 'Numerous periods of depressive-type symptoms', 'Fluctuating mood across 2+ years without symptom-free stretches', 'Distress/impairment from mood instability'],
  i: 'psyedu ipsrt cbt selfmon',
  m: 'Mood chart|ASRM|PHQ-9',
  g: ['Client will maintain daily mood chart for [8] weeks to identify triggers and patterns.', 'Client will stabilize daily routine anchors (wake time, meals, activity) on [5] of 7 days.'],
  r: 'Monitor progression to bipolar I/II and substance use. Screen SI during low periods.',
  t: 'Document chronicity (2+ years adults, 1 year youth) and absence of full manic/major depressive episodes.',
  d: 'Bipolar I/II, borderline personality disorder, substance-induced mood symptoms.',
});

dx('gad', 'Anxiety', 'Generalized Anxiety Disorder', 'F41.1', {
  sx: ['Excessive worry about multiple events or activities', 'Difficulty controlling the worry', 'Restlessness or feeling keyed up', 'Easily fatigued', 'Difficulty concentrating / mind going blank', 'Irritability', 'Muscle tension', 'Sleep disturbance'],
  i: 'cbt iu relax act mind psyedu',
  m: 'GAD-7|PSWQ|BAI|DASS-21',
  g: ['Client will reduce GAD-7 from [baseline] to below 8 within [12–16] weeks.', 'Client will use scheduled worry time and defusion/reappraisal on [5] of 7 days.', 'Client will complete [2] behavioral experiments testing feared outcomes of uncertainty.'],
  r: 'Screen for depression and suicidality (high comorbidity) and for substance or benzodiazepine use as coping. Rule out medical contributors.',
  t: 'Document worry domains and duration (6+ months), physical symptoms, and functional impact. Track GAD-7 trend and tie interventions to it.',
  d: 'Panic disorder, social anxiety, OCD, MDD, hyperthyroidism, caffeine/substance effects, adjustment disorder.',
});
dx('panic', 'Anxiety', 'Panic Disorder', 'F41.0', {
  sx: ['Recurrent unexpected panic attacks', 'Palpitations / racing heart', 'Sweating, trembling, or shortness of breath', 'Chest discomfort, dizziness, nausea', 'Derealization / depersonalization', 'Fear of losing control or dying', 'Persistent worry about future attacks or consequences', 'Avoidance or behavior change related to attacks'],
  i: 'cbt exp psyedu relax',
  m: 'PDSS|ASI-3|GAD-7|Panic diary',
  g: ['Client will reduce panic attacks from [baseline]/week to [≤ target]/week within [12] weeks.', 'Client will complete [interoceptive exposures] daily for [2] weeks with SUDS decreasing from [x] to [y].', 'Client will decrease avoidance of [situations] as measured by hierarchy completion [x/y].'],
  r: 'Rule out medical causes (cardiac, thyroid, medication/stimulant effects). Screen for depression, SI, and substance/alcohol use as self-medication.',
  t: 'Document attack frequency, triggers, avoidance, and safety behaviors. Note interoceptive/in vivo exposure SUDS ratings.',
  d: 'Medical conditions, substance-induced anxiety, PTSD, social anxiety, specific phobia, agoraphobia.',
});
dx('agora', 'Anxiety', 'Agoraphobia', 'F40.00', {
  sx: ['Fear/avoidance of public transportation', 'Fear/avoidance of open spaces', 'Fear/avoidance of enclosed places', 'Fear/avoidance of lines or crowds', 'Fear/avoidance of being outside the home alone', 'Fears centered on being unable to escape or get help', 'Requires companion or endures with intense distress'],
  i: 'exp cbt psyedu relax',
  m: 'Mobility Inventory for Agoraphobia|PDSS|GAD-7',
  g: ['Client will complete [x of y] steps on the avoidance hierarchy within [12] weeks.', 'Client will travel [distance/duration] independently with SUDS < [target].'],
  r: 'Assess homebound status, alcohol/benzodiazepine use, and depression/SI.',
  t: 'Record hierarchy items, SUDS, safety behaviors faded, and functional gains (e.g., independence).',
  d: 'Panic disorder, specific phobia, social anxiety, PTSD, MDD.',
});
dx('sad', 'Anxiety', 'Social Anxiety Disorder', 'F40.10', {
  sx: ['Marked fear of social situations with possible scrutiny', 'Fear of negative evaluation / embarrassment', 'Anxiety symptoms triggered in social settings (blushing, trembling, sweating)', 'Avoidance of social/performance situations', 'Post-event rumination', 'Safety behaviors (rehearsing, avoiding eye contact)', 'Impact on work, school, or relationships'],
  i: 'cbt exp sst psyedu mind',
  m: 'LSAS|SPIN|SIAS',
  g: ['Client will complete [x] social exposures per week from the hierarchy.', 'Client will reduce LSAS from [baseline] to < [target] within [14–16] weeks.', 'Client will drop [specific safety behavior] in [3] exposures.'],
  r: 'Screen for depression, alcohol use as social lubricant, and SI.',
  t: 'Document hierarchy items, predicted vs. actual outcomes in behavioral experiments, and safety behaviors.',
  d: 'Avoidant personality disorder, autism spectrum disorder, panic disorder, normal shyness, MDD.',
});
dx('phobia', 'Anxiety', 'Specific Phobia',
  [['Animal', 'F40.218'], ['Natural environment', 'F40.228'], ['Blood / injection / injury', 'F40.230'], ['Situational', 'F40.248'], ['Other', 'F40.298']], {
  sx: ['Marked fear/anxiety about a specific object or situation', 'Immediate fear response on exposure', 'Active avoidance or endurance with intense fear', 'Fear out of proportion to actual danger', 'Interference with daily functioning'],
  i: 'exp cbt psyedu relax',
  m: 'Fear Survey Schedule|Behavioral Avoidance Test|SUDS ratings',
  g: ['Client will complete the full exposure hierarchy for [stimulus] within [6–8] sessions.', 'Client will approach [target] with SUDS ≤ [x] by [date].'],
  r: 'Blood-injection-injury type can cause fainting; apply tension techniques when appropriate.',
  t: 'Name the phobic stimulus and subtype, avoidance, and measurable approach behaviors.',
  d: 'Panic disorder, OCD, PTSD, social anxiety, agoraphobia.',
});
dx('sepanx', 'Anxiety', 'Separation Anxiety Disorder', 'F93.0', {
  sx: ['Excessive distress on separation from attachment figures', 'Worry about harm befalling attachment figures', 'Reluctance to go to school / be alone', 'Nightmares or physical complaints about separation', 'Difficulty sleeping away from home'],
  i: 'cbt exp pmt psyedu coord',
  m: 'SCARED|SCAS|Parent report',
  g: ['Client will separate from caregiver for [x] minutes with SUDS ≤ [y] by [date].', 'Caregivers will reduce accommodation behaviors (e.g., staying until sleep) on [x] of 7 nights.'],
  r: 'Assess school refusal and caregiver accommodation; screen mood and SI in older youth.',
  t: 'Document family accommodation, exposure ladder, and school coordination (with consent).',
  d: 'GAD, panic disorder, social anxiety, PTSD, school-related stressors.',
});
dx('selmut', 'Anxiety', 'Selective Mutism', 'F94.0', {
  sx: ['Consistent failure to speak in specific social situations', 'Speaks in other settings (e.g., home)', 'Interferes with school or social functioning', 'Present for more than one month (not first month of school)'],
  i: 'exp cbt pmt coord',
  m: 'SMQ (Selective Mutism Questionnaire)|SCARED',
  g: ['Client will speak [word/phrase] to [person] in [setting] on [x] occasions by [date].', 'Caregivers/teacher will use graded exposure and reduce answering for the child.'],
  r: 'Screen for bullying and social anxiety; coordinate with school.',
  t: 'Document settings/people with and without speech and the graded hierarchy progress.',
  d: 'Social anxiety, language or communication disorders, autism spectrum disorder.',
});

dx('ocd', 'Obsessive-Compulsive', 'Obsessive-Compulsive Disorder', 'F42.2', {
  sx: ['Recurrent intrusive unwanted thoughts, images, or urges (obsessions)', 'Repetitive behaviors or mental acts (compulsions)', 'Compulsions performed to reduce distress / prevent feared event', 'Time-consuming (about 1+ hr/day) or impairing', 'Avoidance of triggers', 'Reassurance seeking', 'Family accommodation'],
  i: 'erp cbt psyedu act mind',
  m: 'Y-BOCS|OCI-R|DOCS',
  g: ['Client will reduce Y-BOCS from [baseline] to < [target] within [12–20] weeks.', 'Client will complete [x] ERP practices daily without performing [ritual].', 'Client will reduce time spent on rituals from [x] to [y] hours/day.'],
  r: 'Screen depression/SI. Distinguish unwanted violent/sexual intrusive thoughts (ego-dystonic) from intent; document the distinction clearly.',
  t: 'Document the obsession/compulsion cycle, hierarchy, SUDS, response-prevention success, and family accommodation.',
  d: 'GAD, tic disorders, body-focused repetitive behaviors, psychosis, OCPD, autism spectrum disorder.',
});
dx('bdd', 'Obsessive-Compulsive', 'Body Dysmorphic Disorder', 'F45.22', {
  sx: ['Preoccupation with perceived defects in appearance', 'Repetitive behaviors (mirror checking, grooming, skin picking, comparing)', 'Mental acts (comparing, seeking reassurance)', 'Distress or impairment', 'Avoidance of social situations or being photographed', 'Pursuit of cosmetic procedures'],
  i: 'cbt erp psyedu act',
  m: 'BDD-YBOCS|BDDQ|PHQ-9',
  g: ['Client will reduce mirror checking from [x] to [y] minutes/day.', 'Client will complete [x] exposure exercises (e.g., going without camouflage) weekly.'],
  r: 'Elevated suicide risk; screen at every session. Assess level of insight and delusional conviction.',
  t: 'Document the specific appearance focus, time spent, rituals, insight level, and functional impairment.',
  d: 'Eating disorders, social anxiety, OCD, MDD, gender dysphoria.',
});
dx('hoard', 'Obsessive-Compulsive', 'Hoarding Disorder', 'F42.3', {
  sx: ['Persistent difficulty discarding possessions', 'Perceived need to save items; distress with discarding', 'Clutter compromising use of living spaces', 'Excessive acquisition', 'Distress or impairment (including safety/health risks)'],
  i: 'cbt mi ps coord',
  m: 'SI-R (Saving Inventory-Revised)|Clutter Image Rating Scale',
  g: ['Client will clear [specific area] to its intended use by [date].', 'Client will discard/donate [x] items per week using decision rules.'],
  r: 'Assess fire, fall, sanitation, and eviction risk; consider mandated reporting for dependents or elders at risk.',
  t: 'Document functional use of rooms, safety hazards, insight, and measurable clearing steps. Use motivational interviewing language.',
  d: 'OCD, neurocognitive disorders, depression, psychosis, autism spectrum disorder.',
});
dx('trich', 'Obsessive-Compulsive', 'Trichotillomania (Hair-Pulling Disorder)', 'F63.3', {
  sx: ['Recurrent hair pulling resulting in hair loss', 'Repeated attempts to stop or reduce', 'Distress or impairment', 'Triggers / urges / awareness level (focused vs. automatic)'],
  i: 'hrt cbt act selfmon',
  m: 'MGH-HPS|Pulling diary',
  g: ['Client will reduce pulling episodes from [x]/day to [y]/day within [12] weeks.', 'Client will use competing response at urge onset on [x]% of episodes.'],
  r: 'Screen for depression/anxiety; assess shame and social avoidance.',
  t: 'Document triggers, awareness, sites, and episode logs.',
  d: 'OCD, BDD, psychosis, dermatologic conditions.',
});
dx('excor', 'Obsessive-Compulsive', 'Excoriation (Skin-Picking) Disorder', 'F42.4', {
  sx: ['Recurrent skin picking resulting in lesions', 'Repeated attempts to stop or reduce', 'Distress or impairment', 'Triggers / urges / awareness level'],
  i: 'hrt cbt act selfmon',
  m: 'Skin Picking Scale-Revised|Picking diary',
  g: ['Client will reduce picking time from [x] to [y] minutes/day within [12] weeks.', 'Client will implement stimulus control in [high-risk locations].'],
  r: 'Assess for infection/tissue damage; screen mood, anxiety, and SI.',
  t: 'Document sites, injury severity, triggers, and practiced competing response.',
  d: 'OCD, BDD, substance-induced, dermatologic or medical causes.',
});

dx('ptsd', 'Trauma & Stressor', 'Posttraumatic Stress Disorder', 'F43.10', {
  sx: ['Intrusive memories of the trauma', 'Distressing dreams / nightmares', 'Flashbacks or dissociative reactions', 'Intense distress or reactivity to reminders', 'Avoidance of trauma-related thoughts/feelings', 'Avoidance of external reminders', 'Persistent negative beliefs or blame', 'Persistent negative emotions (fear, guilt, shame, anger)', 'Detachment / diminished interest', 'Inability to experience positive emotions', 'Irritability or angry outbursts', 'Hypervigilance / exaggerated startle', 'Concentration difficulty / sleep disturbance', 'Reckless or self-destructive behavior', 'Dissociation (depersonalization / derealization)'],
  i: 'pe cpt emdr tfcbt ground relax psyedu safety',
  m: 'PCL-5|PC-PTSD-5 (screen)|CAPS-5 (clinician)|PHQ-9|C-SSRS',
  g: ['Client will reduce PCL-5 from [baseline] to < [33] within [12–16] weeks.', 'Client will reduce nightmare frequency from [x] to [y] per week.', 'Client will complete in vivo exposures to [avoided situations] and reduce avoidance (hierarchy [x/y]).'],
  r: 'Elevated risk for SI, substance use, and self-harm. Assess current safety (e.g., ongoing abuse/IPV), dissociation, and readiness for trauma-focused work. Consider mandated reporting obligations.',
  t: 'Document the Criterion A event type generally (avoid unnecessary graphic detail), symptom clusters, PCL-5 trend, SUDS in exposure, and dissociation. Note whether a trauma-focused protocol is being delivered and with what fidelity.',
  d: 'Acute stress disorder, adjustment disorder, MDD, panic disorder, dissociative disorders, TBI, substance-induced symptoms.',
});
dx('asd_acute', 'Trauma & Stressor', 'Acute Stress Disorder', 'F43.0', {
  sx: ['Intrusion symptoms (memories, dreams, flashbacks)', 'Negative mood / inability to feel positive emotion', 'Dissociative symptoms (dazed, derealization)', 'Avoidance of reminders', 'Arousal (sleep disturbance, hypervigilance, irritability)', 'Duration of 3 days to 1 month after trauma'],
  i: 'ground psyedu cbt relax safety',
  m: 'Acute Stress Disorder Scale (ASDS)|PCL-5 (after 1 month)|PHQ-9',
  g: ['Client will use grounding and sleep-stabilization skills daily for [2] weeks.', 'Client will re-establish [safe routines] and social contact within [x] days.'],
  r: 'Assess ongoing danger, SI, and substance use. Reassess at 1 month for PTSD.',
  t: 'Document date of event, time since event (3 days–1 month), and symptom count/clusters.',
  d: 'PTSD, adjustment disorder, brief psychotic disorder, medical causes (e.g., head injury).',
});
dx('adj', 'Trauma & Stressor', 'Adjustment Disorder',
  [['With depressed mood', 'F43.21'], ['With anxiety', 'F43.22'], ['With mixed anxiety and depressed mood', 'F43.23'], ['With disturbance of conduct', 'F43.24'], ['With mixed disturbance of emotions and conduct', 'F43.25'], ['Unspecified', 'F43.20']], {
  sx: ['Emotional or behavioral symptoms in response to an identifiable stressor', 'Distress out of proportion to the stressor', 'Impairment in social/occupational functioning', 'Onset within 3 months of stressor', 'Low mood, anxiety, or conduct changes'],
  i: 'ps cbt sup psyedu mind',
  m: 'PHQ-9|GAD-7|ASDS|Adjustment Disorder New Module (ADNM-20)',
  g: ['Client will identify [3] coping strategies for [stressor] and use one daily.', 'Client will return to baseline functioning (work/school/social) by [date].'],
  r: 'Adjustment disorder carries meaningful suicide risk, particularly in youth. Screen SI each session.',
  t: 'Name the stressor and its date; note that symptoms should not persist beyond 6 months after the stressor ends. Document functional impairment and expected time-limited course.',
  d: 'MDD, GAD, PTSD/ASD, normal stress response, prolonged grief disorder.',
});
dx('pgd', 'Trauma & Stressor', 'Prolonged Grief Disorder', 'F43.81', {
  sx: ['Intense yearning or preoccupation with the deceased', 'Identity disruption (feeling part of self has died)', 'Marked sense of disbelief about the death', 'Avoidance of reminders that the person is dead', 'Intense emotional pain (anger, bitterness, sorrow)', 'Difficulty reintegrating into relationships/activities', 'Emotional numbness', 'Feeling life is meaningless', 'Intense loneliness'],
  i: 'grief ipt cbt act sup',
  m: 'PG-13-R|Inventory of Complicated Grief (ICG)|PHQ-9',
  g: ['Client will reduce PG-13-R / ICG score from [baseline] to < [target] within [16] weeks.', 'Client will engage in [x] restoration-oriented activities per week.', 'Client will complete imaginal revisiting and situational revisiting exercises as assigned.'],
  r: 'Elevated SI risk; screen regularly. Assess reasons for living, isolation, and substance use.',
  t: 'Document date of death, time since loss (12+ months adults; 6+ months children/adolescents), cultural norms for mourning, and functional impact.',
  d: 'Normal grief, MDD, PTSD, adjustment disorder.',
});

dx('adhd', 'Neurodevelopmental', 'Attention-Deficit/Hyperactivity Disorder',
  [['Combined presentation', 'F90.2'], ['Predominantly inattentive presentation', 'F90.0'], ['Predominantly hyperactive-impulsive presentation', 'F90.1'], ['Other specified', 'F90.8'], ['Unspecified', 'F90.9']], {
  sx: ['Careless mistakes / lack of detail', 'Difficulty sustaining attention', 'Seems not to listen when spoken to', 'Fails to follow through on tasks', 'Difficulty organizing tasks and time', 'Avoids tasks requiring sustained effort', 'Loses necessary items', 'Easily distracted', 'Forgetful in daily activities', 'Fidgets or squirms', 'Leaves seat / feels restless', 'Difficulty engaging quietly in leisure', '"On the go" / talks excessively', 'Blurts out answers / interrupts', 'Difficulty waiting turn'],
  i: 'orgskills cbt psyedu pmt coord selfmon',
  m: 'ASRS v1.1|CAARS|Vanderbilt (child)|Conners',
  g: ['Client will use planner/phone system to complete [x]% of scheduled tasks weekly.', 'Parents will implement a daily behavior-reward system [5] days/week.', 'Client will reduce [specific behavior] from [x] to [y] per week.'],
  r: 'Screen for comorbid anxiety, depression, substance use, and accidental injury risk. Coordinate care with prescriber or school when applicable.',
  t: 'Document symptoms across 2+ settings, onset before age 12, and specific functional impacts. Link skills (e.g., planner use) to measurable outcomes. Note school accommodations or medication coordination.',
  d: 'Anxiety, mood disorders, learning disorders, trauma, sleep disorders, autism spectrum disorder, substance use.',
});
dx('autism', 'Neurodevelopmental', 'Autism Spectrum Disorder', 'F84.0', {
  sx: ['Difficulty with social-emotional reciprocity', 'Difficulty with nonverbal communication', 'Difficulty developing/maintaining relationships', 'Repetitive movements, speech, or object use', 'Insistence on sameness / routines', 'Highly restricted, intense interests', 'Sensory over- or under-reactivity', 'Support needs level (1/2/3) and current functioning'],
  i: 'asd sst cbt pmt coord psyedu',
  m: 'SRS-2|ABAS-3|Vineland-3|Anxiety/mood measures (adapted)',
  g: ['Client will use [skill] with [person] in [x] of [y] opportunities.', 'Caregivers will use visual supports for [routine] daily.', 'Client will use coping tool for [sensory/emotional trigger] in [x] of [y] situations.'],
  r: 'Elevated rates of anxiety, depression, and SI in autistic individuals; assess elopement and safety needs. Coordinate with school and community supports.',
  t: 'Document the support level, sensory/communication needs, adaptations used in therapy, and caregiver involvement. Diagnosis requires a comprehensive developmental evaluation.',
  d: 'Social communication disorder, ADHD, anxiety, language disorder, intellectual disability, trauma.',
});

dx('scz', 'Psychotic', 'Schizophrenia', 'F20.9', {
  sx: ['Delusions', 'Hallucinations', 'Disorganized speech', 'Grossly disorganized or catatonic behavior', 'Negative symptoms (diminished emotional expression, avolition)', 'Decline in work, relationships, or self-care', 'Insight and treatment adherence concerns'],
  i: 'cbtp famedu sst psyedu coord ps',
  m: 'PANSS / BPRS (clinician)|CAINS|PHQ-9|C-SSRS',
  g: ['Client will attend [x]% of scheduled appointments and take medication as prescribed ([adherence method]).', 'Client will use [coping strategy] for voices rated __/10 distress in [x] of [y] episodes.', 'Client will participate in [x] structured community/vocational activities per week.'],
  r: 'Assess command hallucinations, SI (risk is elevated especially in early course and post-discharge), violence risk, grave disability, and medication adherence. Coordinate with psychiatric prescriber and case management.',
  t: 'Document observable symptoms and functioning (not just client reports), insight, adherence, and coordination of care. Use specific, behavioral language when describing delusional content.',
  d: 'Schizoaffective disorder, mood disorder with psychotic features, substance/medication-induced psychosis, brief psychotic disorder, medical causes.',
});
dx('sza', 'Psychotic', 'Schizoaffective Disorder',
  [['Bipolar type', 'F25.0'], ['Depressive type', 'F25.1']], {
  sx: ['Psychotic symptoms (delusions, hallucinations, disorganization)', 'Major mood episode (manic or depressive) concurrent with psychosis', 'Psychotic symptoms persisting without mood symptoms', 'Mood symptoms present for much of the illness', 'Functional impairment'],
  i: 'cbtp famedu ipsrt sst psyedu coord safety',
  m: 'PANSS / BPRS (clinician)|PHQ-9|ASRM|C-SSRS',
  g: ['Client will maintain mood and sleep chart and bring to [weekly] sessions.', 'Client will attend prescriber visits and report medication adherence barriers.', 'Client will use identified coping plan for distressing voices/beliefs in [x] of [y] episodes.'],
  r: 'Combined psychosis and mood risk; assess SI, command hallucinations, mania-related risk, and medication adherence.',
  t: 'Document mood and psychotic symptoms separately, their temporal relationship, and coordination with the prescriber.',
  d: 'Schizophrenia, bipolar I with psychotic features, MDD with psychotic features, substance-induced psychosis.',
});

dx('an', 'Eating', 'Anorexia Nervosa',
  [['Restricting type, mild', 'F50.010'], ['Restricting type, moderate', 'F50.011'], ['Restricting type, severe', 'F50.012'], ['Restricting type, extreme', 'F50.013'], ['Restricting type, in remission', 'F50.014'], ['Binge-eating/purging type, mild', 'F50.020'], ['Binge-eating/purging type, moderate', 'F50.021'], ['Binge-eating/purging type, severe', 'F50.022'], ['Binge-eating/purging type, extreme', 'F50.023'], ['Binge-eating/purging type, in remission', 'F50.024']], {
  sx: ['Restriction of intake leading to significantly low body weight', 'Intense fear of gaining weight / persistent behavior preventing gain', 'Disturbed body image / undue influence of weight on self-evaluation', 'Lack of recognition of seriousness of low weight', 'Excessive exercise', 'Purging or laxative/diuretic use', 'Binge episodes (if binge-purge type)'],
  i: 'fbt cbte mi psyedu coord selfmon',
  m: 'EDE-Q|Eating Attitudes Test (EAT-26)|Weight/vitals from medical provider',
  g: ['Client will follow meal plan with [x]% adherence per food record.', 'Client will reach/maintain target weight range set by medical team by [date].', 'Client will reduce compensatory behaviors from [x] to [y] per week.'],
  r: 'Medical instability (bradycardia, electrolyte abnormalities, orthostasis) and high mortality including suicide. Document medical monitoring and criteria for higher level of care. Do not manage weight/medical risk alone.',
  t: 'Document weight/vitals source and date, behaviors (restriction, purging, exercise), overvaluation of shape/weight, and care-team coordination (medical, dietitian, psychiatry).',
  d: 'Bulimia nervosa, ARFID, medical or GI illness, depression, OCD.',
});
dx('bn', 'Eating', 'Bulimia Nervosa',
  [['Mild', 'F50.21'], ['Moderate', 'F50.22'], ['Severe', 'F50.23'], ['Extreme', 'F50.24'], ['In remission', 'F50.25'], ['Unspecified', 'F50.20']], {
  sx: ['Recurrent binge-eating episodes with loss of control', 'Compensatory behaviors (vomiting, laxatives, fasting, exercise)', 'Self-evaluation unduly influenced by shape/weight', 'Frequency of behaviors per week', 'Dietary restriction'],
  i: 'cbte fbt mi selfmon coord',
  m: 'EDE-Q|BES|Food record',
  g: ['Client will establish regular eating (3 meals + 2–3 snacks) on [x] of 7 days.', 'Client will reduce binge/purge episodes from [x] to [y] per week within [20] weeks.'],
  r: 'Electrolyte disturbance and cardiac risk from purging; SI and self-harm. Coordinate with medical provider.',
  t: 'Document weekly episode counts, regular-eating adherence, and medical monitoring.',
  d: 'Binge-eating disorder, anorexia nervosa (binge-purge), MDD, substance use.',
});
dx('bed', 'Eating', 'Binge-Eating Disorder',
  [['Mild', 'F50.810'], ['Moderate', 'F50.811'], ['Severe', 'F50.812'], ['Extreme', 'F50.813'], ['In remission', 'F50.814'], ['Unspecified', 'F50.819']], {
  sx: ['Recurrent binge-eating episodes with loss of control', 'Eating rapidly / until uncomfortably full / when not hungry', 'Eating alone due to embarrassment', 'Marked distress about binge eating (guilt, disgust)', 'No regular compensatory behaviors'],
  i: 'cbte ipt mi selfmon coord',
  m: 'BES|EDE-Q|Food record',
  g: ['Client will reduce binge episodes from [x] to [y] per week within [16–20] weeks.', 'Client will use a coping alternative at urge in [x]% of episodes.'],
  r: 'Medical comorbidities (weight-related); depression and SI. Avoid weight stigma in language and approach.',
  t: 'Document binge frequency, triggers, and regular-eating adherence.',
  d: 'Bulimia nervosa, MDD, night eating syndrome, medical conditions.',
});

dx('aud', 'Substance Use', 'Alcohol Use Disorder',
  [['Mild', 'F10.10'], ['Moderate', 'F10.20'], ['Severe', 'F10.20'], ['Mild, in early/sustained remission', 'F10.11'], ['Moderate/Severe, in early/sustained remission', 'F10.21']], {
  sx: SUD_SX,
  i: 'mi rp cbt cm psyedu coord',
  m: 'AUDIT|AUDIT-C|Timeline Followback|C-SSRS',
  g: ['Client will maintain abstinence (or reduce to [x] drinks/week) as measured by self-report and [verification] for [x] weeks.', 'Client will identify [3] high-risk situations and rehearse a coping response for each.', 'Client will attend [x] mutual-help/support meetings per week.'],
  r: 'Assess withdrawal risk (alcohol withdrawal can be medically dangerous), SI, driving under the influence, and overdose risk. Coordinate with medical providers for detox or pharmacotherapy.',
  t: 'Document use frequency/quantity, last use, readiness-to-change stage, consequences, and medical coordination. Severity is based on criteria count (2–3 mild, 4–5 moderate, 6+ severe).',
  d: 'Other substance use, mood/anxiety disorders, medical conditions.',
});
dx('oud', 'Substance Use', 'Opioid Use Disorder',
  [['Mild', 'F11.10'], ['Moderate/Severe', 'F11.20'], ['Mild, in remission', 'F11.11'], ['Moderate/Severe, in remission', 'F11.21']], {
  sx: SUD_SX,
  i: 'mi cm rp cbt psyedu coord',
  m: 'DAST-10|COWS (medical)|Timeline Followback|C-SSRS',
  g: ['Client will attend [x]% of medication-for-OUD and counseling appointments.', 'Client will remain abstinent from non-prescribed opioids for [x] weeks (verified by [method]).', 'Client will have naloxone accessible and review overdose plan with support persons.'],
  r: 'High overdose risk, especially after reduced tolerance (post-detox/incarceration). Review naloxone access. Medications for OUD (buprenorphine, methadone, naltrexone) reduce mortality; coordinate with prescriber.',
  t: 'Document use pattern, route, last use, treatment engagement, overdose-prevention counseling, and prescriber coordination.',
  d: 'Other substance use, chronic pain, mood and trauma disorders.',
});
dx('cud', 'Substance Use', 'Cannabis Use Disorder',
  [['Mild', 'F12.10'], ['Moderate/Severe', 'F12.20'], ['Mild, in remission', 'F12.11'], ['Moderate/Severe, in remission', 'F12.21']], {
  sx: SUD_SX,
  i: 'mi cbt cm rp psyedu',
  m: 'CUDIT-R|Timeline Followback',
  g: ['Client will reduce use from [x] days/week to [y] (or abstain) within [12] weeks.', 'Client will use [alternative coping] in [x] of [y] craving episodes.'],
  r: 'Screen for psychosis risk, depression/anxiety, and driving under influence.',
  t: 'Document frequency, quantity, motivations (sleep, anxiety), and readiness-to-change.',
  d: 'Anxiety, depression, psychotic disorders, other substance use.',
});
dx('stim', 'Substance Use', 'Stimulant Use Disorder',
  [['Cocaine, mild', 'F14.10'], ['Cocaine, moderate/severe', 'F14.20'], ['Other stimulant (e.g., methamphetamine), mild', 'F15.10'], ['Other stimulant (e.g., methamphetamine), moderate/severe', 'F15.20']], {
  sx: SUD_SX,
  i: 'cm cbt mi rp psyedu coord',
  m: 'DAST-10|Timeline Followback|PHQ-9',
  g: ['Client will submit [x] negative screens per week under contingency management.', 'Client will identify [3] triggers and practice a plan for each.'],
  r: 'Assess psychosis, cardiovascular risk, aggression, suicidality during crash, and overdose (fentanyl contamination). Contingency management has the strongest evidence.',
  t: 'Document use pattern, route, last use, verified screens, and risk reduction counseling.',
  d: 'Primary psychotic or mood disorders, ADHD, other substance use.',
});
dx('tob', 'Substance Use', 'Tobacco Use Disorder',
  [['Moderate/Severe', 'F17.200'], ['Mild', 'Z72.0']], {
  sx: SUD_SX,
  i: 'mi cbt rp psyedu coord',
  m: 'FTND / HSI|Cigarettes per day|Quit date log',
  g: ['Client will set a quit date by [date] and abstain for [x] weeks.', 'Client will use cessation medications/NRT as directed (with prescriber).'],
  r: 'Medical comorbidity; coordinate pharmacotherapy with prescriber; quitline referral (1-800-QUIT-NOW in US).',
  t: 'Document quantity, quit attempts, readiness, and supports.',
  d: 'Other substance use, nicotine withdrawal effects on mood/sleep.',
});
dx('gamb', 'Substance Use', 'Gambling Disorder', 'F63.0', {
  sx: ['Needs to gamble with increasing amounts', 'Restlessness or irritability when cutting down', 'Repeated unsuccessful efforts to stop', 'Preoccupation with gambling', 'Gambling when distressed', 'Chasing losses', 'Lying to conceal gambling', 'Jeopardized relationships, job, or education', 'Relying on others for financial bailouts'],
  i: 'cbt mi rp ps coord',
  m: 'PGSI|Gambling Symptom Assessment Scale',
  g: ['Client will remain abstinent from gambling for [x] weeks; use self-exclusion and blocking tools.', 'Client will develop a debt-repayment and financial-control plan with [support person].'],
  r: 'High suicide risk; screen each session. Assess financial crisis, legal issues, and family safety.',
  t: 'Document gambling type, losses/debts, access restrictions (blocking software, self-exclusion), and consequences.',
  d: 'Bipolar disorder (manic gambling), personality disorders, other addictions.',
});

dx('bpd', 'Personality', 'Borderline Personality Disorder', 'F60.3', {
  sx: ['Frantic efforts to avoid abandonment', 'Unstable, intense relationships (idealization/devaluation)', 'Unstable self-image or identity', 'Impulsivity in potentially damaging areas', 'Suicidal behavior or self-harm', 'Affective instability / intense mood reactivity', 'Chronic feelings of emptiness', 'Intense anger or difficulty controlling anger', 'Stress-related paranoia or dissociation'],
  i: 'dbt mbt schema tfp act safety crisis',
  m: 'BSL-23|DERS|ZAN-BPD|C-SSRS',
  g: ['Client will reduce self-harm episodes from [x] to [0] over [12] weeks (diary card).', 'Client will use a skills sequence (e.g., TIPP → opposite action) in [x] of [y] distress spikes.', 'Client will reduce emergency/ED visits from [x] to [y] per month.'],
  r: 'High chronic risk with fluctuating acute risk. Distinguish self-harm without suicidal intent from suicidal behavior and document both. Maintain a consistent crisis plan and avoid rushing to hospitalization when chronic patterns apply; consult.',
  t: 'Document specific target behaviors (self-harm, SI, therapy-interfering, quality-of-life), diary card review, skills used, and consultation. Use neutral, non-pejorative language.',
  d: 'Bipolar II, PTSD/complex trauma, ADHD, substance use, other personality disorders.',
});
dx('avpd', 'Personality', 'Avoidant Personality Disorder', 'F60.6', {
  sx: ['Avoids occupational activity involving significant interpersonal contact', 'Unwilling to get involved without certainty of being liked', 'Restraint in intimate relationships for fear of shame', 'Preoccupied with criticism or rejection', 'Inhibited in new situations due to inadequacy feelings', 'Views self as inept or inferior', 'Reluctant to take personal risks'],
  i: 'cbt schema exp sst act',
  m: 'SIAS|SPIN|PDQ-4',
  g: ['Client will complete [x] graduated interpersonal exposures per week.', 'Client will challenge "I am inadequate" core belief with [x] behavioral experiments.'],
  r: 'Screen depression, social isolation, SI, and alcohol use.',
  t: 'Document the pervasive pattern (not situation-specific), exposure targets, and core beliefs.',
  d: 'Social anxiety disorder, autism spectrum disorder, schizoid or other PDs, MDD.',
});
dx('dpd', 'Personality', 'Dependent Personality Disorder', 'F60.7', {
  sx: ['Difficulty making everyday decisions without excessive advice', 'Needs others to assume responsibility for major areas of life', 'Difficulty disagreeing for fear of loss of support', 'Difficulty initiating projects independently', 'Goes to excessive lengths to obtain nurturance', 'Feels helpless when alone', 'Urgently seeks another relationship when one ends', 'Unrealistic fear of being left to care for self'],
  i: 'cbt schema sst act',
  m: 'PDQ-4|ASQ|Decision log',
  g: ['Client will make [x] independent decisions per week and tolerate the discomfort without seeking reassurance.', 'Client will practice assertive disagreement in [x] situations.'],
  r: 'Screen for abusive relationships, depression, and SI.',
  t: 'Document patterns across contexts and specific behavioral goals for autonomy.',
  d: 'Avoidant PD, borderline PD, anxiety and depressive disorders, agoraphobia.',
});
dx('ocpd', 'Personality', 'Obsessive-Compulsive Personality Disorder', 'F60.5', {
  sx: ['Preoccupation with details, rules, lists, or schedules', 'Perfectionism interfering with task completion', 'Excessive devotion to work at expense of leisure', 'Overconscientious and inflexible about morality or values', 'Unable to discard worthless items', 'Reluctant to delegate', 'Miserly spending style', 'Rigidity and stubbornness'],
  i: 'cbt act schema mind',
  m: 'PDQ-4|Perfectionism measures (CPQ)',
  g: ['Client will complete [x] tasks "good enough" without extra rechecking.', 'Client will schedule and attend [x] leisure/relationship activities weekly.'],
  r: 'Screen depression, anxiety, SI, and burnout.',
  t: 'Document inflexibility across domains and the impact on relationships/work; distinguish from OCD.',
  d: 'OCD, anxiety, autism spectrum disorder, narcissistic PD.',
});
dx('npd', 'Personality', 'Narcissistic Personality Disorder', 'F60.81', {
  sx: ['Grandiose sense of self-importance', 'Preoccupation with fantasies of success or power', 'Belief in being special or unique', 'Requires excessive admiration', 'Sense of entitlement', 'Interpersonally exploitative', 'Lacks empathy', 'Envy of others or belief others envy them', 'Arrogant or haughty behaviors'],
  i: 'schema mbt tfp cbt',
  m: 'PDQ-4|NPI|Alliance measures (WAI)',
  g: ['Client will identify [x] instances of impact on others and respond with a repair behavior.', 'Client will complete [x] therapy tasks that tolerate shame/criticism without withdrawal.'],
  r: 'Fragile self-esteem with high shame; SI risk rises with narcissistic injury, relationship loss, or job loss. Screen when stressors occur.',
  t: 'Document alliance, ruptures/repairs, specific behavioral targets, and neutral descriptions of interpersonal patterns (avoid pejoratives).',
  d: 'Bipolar disorder (hypomania), antisocial or borderline PD, substance use, MDD.',
});

dx('odd', 'Disruptive/Conduct', 'Oppositional Defiant Disorder', 'F91.3', {
  sx: ['Often loses temper', 'Often touchy or easily annoyed', 'Often angry and resentful', 'Often argues with authority figures', 'Often defies or refuses to comply with rules', 'Deliberately annoys others', 'Blames others for own mistakes', 'Spiteful or vindictive'],
  i: 'pmt cbt ps coord',
  m: 'ECBI|Vanderbilt|SNAP-IV|Parent behavior log',
  g: ['Parents will use praise and clear commands with [x]:1 positive-to-corrective ratio daily.', 'Client will reduce defiance episodes from [x] to [y] per week.'],
  r: 'Screen for safety, trauma, bullying, and escalation to aggression.',
  t: 'Document settings, frequency, caregiver strategies, and parent participation.',
  d: 'ADHD, anxiety, depression/DMDD, trauma, learning disorders, conduct disorder.',
});
dx('cd', 'Disruptive/Conduct', 'Conduct Disorder',
  [['Childhood-onset', 'F91.1'], ['Adolescent-onset', 'F91.2'], ['Unspecified onset', 'F91.9']], {
  sx: ['Aggression toward people or animals', 'Destruction of property', 'Deceitfulness or theft', 'Serious violations of rules (truancy, running away)', 'Callous / limited prosocial emotions (specifier)', 'Legal system involvement'],
  i: 'pmt ps cbt coord',
  m: 'Vanderbilt|CBCL|ICU (Inventory of Callous-Unemotional Traits)',
  g: ['Family will implement a structured behavior plan [x] days/week.', 'Client will reduce [specified conduct behavior] from [x] to [y] per month.'],
  r: 'Assess violence risk, firearms access, substance use, and abuse/neglect. Consider multisystemic interventions and legal/mandated-reporting obligations.',
  t: 'Document onset type, specific behaviors, and family/school/legal coordination.',
  d: 'ODD, ADHD, trauma, mood disorders, substance use.',
});
dx('ied', 'Disruptive/Conduct', 'Intermittent Explosive Disorder', 'F63.81', {
  sx: ['Verbal or physical aggression with low threshold', 'Outbursts grossly out of proportion to provocation', 'Outbursts are impulsive (not premeditated)', 'Marked distress or functional/legal consequences', 'Triggers and warning signs'],
  i: 'cbt relax ps dbt',
  m: 'Overt Aggression Scale|STAXI-2|Anger log',
  g: ['Client will reduce outbursts from [x] to [y] per month.', 'Client will use cue-controlled relaxation/time-out in [x] of [y] trigger events.'],
  r: 'Assess risk to others, weapons access, domestic violence, legal consequences, and substance use.',
  t: 'Document triggers, warning signs, intensity, and consequences with objective descriptions.',
  d: 'Bipolar disorder, ADHD, substance use, TBI, PTSD, antisocial or borderline PD.',
});

dx('insom', 'Sleep', 'Insomnia Disorder', 'F51.01', {
  sx: ['Difficulty falling asleep', 'Difficulty staying asleep', 'Early-morning awakening', 'Daytime fatigue / impaired functioning', 'Occurs 3+ nights/week for 3+ months', 'Sleep-related worry / conditioned arousal'],
  i: 'cbti relax mind psyedu selfmon coord',
  m: 'ISI|PSQI|Sleep diary',
  g: ['Client will increase sleep efficiency from [x]% to ≥ 85% within [6–8] weeks.', 'Client will follow a consistent rise time [7] days/week.', 'Client will reduce ISI from [baseline] to < 8.'],
  r: 'Screen for depression, SI, substance use, sleep apnea and other medical contributors. Coordinate with medical provider as needed.',
  t: 'Document sleep diary data (TIB, TST, sleep efficiency) and changes in sleep window. CBT-I is first-line.',
  d: 'Sleep apnea, restless legs, circadian disorders, depression, anxiety, substance effects.',
});

dx('ssd', 'Somatic & Dissociative', 'Somatic Symptom Disorder', 'F45.1', {
  sx: ['Distressing or disruptive somatic symptoms', 'Disproportionate and persistent thoughts about seriousness', 'Persistently high anxiety about health', 'Excessive time and energy on symptoms/health concerns', 'Symptoms persist 6+ months'],
  i: 'cbt psyedu relax mind coord',
  m: 'PHQ-15|SSS-8|SSAS',
  g: ['Client will reduce health-related checking/reassurance seeking from [x] to [y] per day.', 'Client will engage in [x] valued activities despite symptoms.'],
  r: 'Do not dismiss symptoms; coordinate with PCP to avoid duplicate testing. Screen for depression, anxiety, and SI.',
  t: 'Document symptoms, health beliefs, medical coordination, and function-oriented goals.',
  d: 'Medical conditions, illness anxiety disorder, panic disorder, depression, conversion disorder.',
});
dx('iad', 'Somatic & Dissociative', 'Illness Anxiety Disorder', 'F45.21', {
  sx: ['Preoccupation with having or acquiring a serious illness', 'Minimal or no somatic symptoms', 'High anxiety about health', 'Excessive health-related behaviors (checking) or avoidance', 'Persisting 6+ months'],
  i: 'cbt exp psyedu mind',
  m: 'Whiteley Index (WI-7)|Health Anxiety Inventory (SHAI)',
  g: ['Client will reduce body-checking/reassurance-seeking from [x] to [y] per day.', 'Client will complete [x] exposures to health-related uncertainty.'],
  r: 'Screen depression, anxiety, and SI; coordinate with PCP to limit unnecessary testing.',
  t: 'Document specific health fears, safety behaviors, and exposures.',
  d: 'Somatic symptom disorder, GAD, panic disorder, OCD, medical illness.',
});
dx('dpdr', 'Somatic & Dissociative', 'Depersonalization/Derealization Disorder', 'F48.1', {
  sx: ['Persistent feelings of detachment from self (depersonalization)', 'Persistent feelings of unreality of surroundings (derealization)', 'Reality testing remains intact', 'Distress or impairment'],
  i: 'ground cbt psyedu mind',
  m: 'Cambridge Depersonalization Scale|DES-II',
  g: ['Client will use grounding at onset in [x] of [y] episodes.', 'Client will reduce time in dissociated states from [x] to [y] hours/day.'],
  r: 'Rule out substance, seizure, migraine, and medical causes. Screen for anxiety, depression, SI, and trauma.',
  t: 'Document frequency, triggers, intactness of reality testing, and strategies used.',
  d: 'PTSD, panic disorder, substance-induced, psychosis, epilepsy.',
});
dx('did', 'Somatic & Dissociative', 'Dissociative Identity Disorder', 'F44.81', {
  sx: ['Two or more distinct identity states', 'Recurrent gaps in recall of everyday events or trauma', 'Distress or impairment', 'Identity-state shifts observed or reported'],
  i: 'ground psyedu safety coord',
  m: 'DES-II|MID|SCID-D|Trauma measures',
  g: ['Client will use grounding and stabilization skills in [x] of [y] dissociative episodes.', 'Client will increase internal communication/cooperation per treatment plan.'],
  r: 'High risk for self-harm and SI. Phase-oriented treatment (stabilization first); consider consultation or specialist supervision.',
  t: 'Document observable state shifts neutrally, amnesia reports, stabilization progress, and consultation.',
  d: 'PTSD, BPD, psychotic disorders, seizures, substance use.',
});

dx('gd', 'Other', 'Gender Dysphoria (adolescents and adults)', 'F64.0', {
  sx: ['Marked incongruence between experienced and assigned gender', 'Desire to be rid of primary/secondary sex characteristics', 'Desire for characteristics of another gender', 'Distress or impairment from incongruence', 'Minority stress / family or social support concerns'],
  i: 'sup psyedu act cbt coord',
  m: 'Utrecht Gender Dysphoria Scale|PHQ-9|GAD-7',
  g: ['Client will identify [x] supportive people/resources and connect with [x] by [date].', 'Client will explore gender identity goals and care options at own pace.'],
  r: 'Elevated rates of anxiety, depression, and SI associated with minority stress and rejection. Screen regularly. Use client\'s name and pronouns in notes. Gender diversity itself is not a disorder; the diagnosis can support access to care.',
  t: 'Document affirmed name/pronouns, distress/impairment, supports, and care coordination or letters (per WPATH SOC-8) as requested by the client.',
  d: 'Body dysmorphic disorder, depression, anxiety, trauma-related symptoms.',
});
dx('z630', 'Other', 'Relationship Distress with Spouse or Intimate Partner', 'Z63.0', {
  sx: ['Recurrent conflict', 'Communication breakdown / withdrawal', 'Emotional or physical disconnection', 'Trust injury / infidelity', 'Considering separation'],
  i: 'couples ps psyedu sst',
  m: 'RDAS|DAS-7|Couples Satisfaction Index',
  g: ['Couple will complete [x] structured communication exercises per week.', 'Couple will reduce destructive conflict episodes from [x] to [y] per week.'],
  r: 'Screen both partners individually for intimate partner violence before couples work. Do not proceed with conjoint therapy when safety is compromised.',
  t: 'Document who attended, the interactional cycle, IPV screening, and interventions with each partner\'s response. Note that Z-codes may not meet medical necessity for all payers.',
  d: 'Mood/anxiety disorders, substance use, IPV, individual disorders contributing to conflict.',
});
dx('z634', 'Other', 'Uncomplicated Bereavement', 'Z63.4', {
  sx: ['Sadness / yearning related to a recent death', 'Sleep or appetite change', 'Disrupted concentration or routines', 'Social withdrawal', 'Cultural or spiritual mourning practices'],
  i: 'grief sup psyedu mind',
  m: 'PG-13-R (for later screening)|PHQ-9|ICG',
  g: ['Client will identify and use [x] supports and rituals for remembrance.', 'Client will maintain basic self-care and routines [x] days/week.'],
  r: 'Monitor for development of major depression or prolonged grief; screen SI.',
  t: 'Document the loss, relationship, time since the death, and cultural context. A Z-code may not be billable for all payers.',
  d: 'MDD, adjustment disorder, prolonged grief disorder, PTSD.',
});

const DX_CATEGORIES = [...new Set(DX.map(d => d.cat))];

/* ---------- Mental status exam options ---------- */
const MSE_FIELDS = [
  { key: 'appearance', label: 'Appearance', opts: ['Well-groomed, appropriately dressed', 'Casually dressed, adequately groomed', 'Disheveled / poor hygiene', 'Unusual dress or appearance', 'Appears older/younger than stated age'] },
  { key: 'behavior', label: 'Behavior / eye contact', short: 'Behavior', opts: ['Cooperative, engaged, good eye contact', 'Cooperative, limited eye contact', 'Guarded', 'Restless / agitated', 'Psychomotor slowing', 'Withdrawn', 'Hypervigilant', 'Tearful'] },
  { key: 'speech', label: 'Speech', opts: ['Normal rate, volume, and tone', 'Slowed / soft', 'Pressured / rapid', 'Loud', 'Sparse / limited'] },
  { key: 'affect', label: 'Affect', opts: ['Full range, congruent with mood', 'Euthymic', 'Constricted', 'Blunted', 'Flat', 'Labile', 'Anxious', 'Tearful', 'Irritable', 'Expansive', 'Incongruent with mood'] },
  { key: 'thoughtProcess', label: 'Thought process', short: 'Thought process', opts: ['Linear and goal-directed', 'Circumstantial', 'Tangential', 'Loosened associations', 'Flight of ideas', 'Thought blocking', 'Disorganized'] },
  { key: 'thoughtContent', label: 'Thought content', opts: ['No delusions or obsessions noted', 'Ruminations / worries', 'Obsessions', 'Paranoid ideation', 'Delusional content', 'Preoccupation with ___'] },
  { key: 'perception', label: 'Perception', opts: ['No hallucinations reported or observed', 'Auditory hallucinations', 'Visual hallucinations', 'Dissociative experiences', 'Responding to internal stimuli'] },
  { key: 'cognition', label: 'Orientation / cognition', short: 'Cognition', opts: ['Alert and oriented x4', 'Alert and oriented x3', 'Attention / concentration impaired', 'Memory impairment noted', 'Confused / disoriented'] },
  { key: 'insight', label: 'Insight', opts: ['Good', 'Fair', 'Limited', 'Poor'] },
  { key: 'judgment', label: 'Judgment', opts: ['Intact', 'Fair', 'Impaired'] },
];

/* ---------- Risk options ---------- */
const SI_OPTS = [
  ['none', 'Denies suicidal ideation, intent, and plan'],
  ['passive', 'Passive SI (wishes to be dead / not wake up), no plan or intent'],
  ['active_noplan', 'Active SI, no plan or intent'],
  ['active_plan', 'Active SI with plan, no intent'],
  ['active_intent', 'Active SI with plan and intent'],
];
const HI_OPTS = [
  ['none', 'Denies homicidal ideation, intent, and plan'],
  ['ideation', 'Homicidal ideation, no plan or intent'],
  ['plan', 'Homicidal ideation with plan and/or intent'],
];
const SH_OPTS = [
  ['none', 'Denies self-harm urges or behavior'],
  ['urges', 'Urges to self-harm, no behavior since last session'],
  ['recent', 'Self-harm behavior since last session'],
  ['ongoing', 'Ongoing / escalating self-harm'],
];
const ABUSE_OPTS = [
  ['none', 'No abuse / neglect / IPV concerns identified'],
  ['reported', 'Abuse / neglect / IPV concern disclosed or observed'],
];
const PROTECTIVE = ['Reasons for living identified', 'Social support', 'Engaged in treatment', 'Future orientation / hope', 'Limited access to means', 'Children / pets / dependents', 'Employment / school', 'Spiritual / cultural connection', 'Help-seeking history', 'Sobriety / abstinence'];
const RISK_ACTIONS = ['Safety plan created / reviewed', 'Means-safety counseling provided', 'Crisis resources provided (988 / local)', 'Increased session frequency', 'Consulted supervisor / colleague', 'Coordinated with prescriber / PCP', 'Contacted emergency contact / support person (with consent)', 'Emergency evaluation / hospitalization arranged', 'Mandated report filed', 'Duty-to-protect analysis completed', 'No additional action required'];

const IMPAIRMENT = ['Work / school', 'Relationships / social', 'Family functioning', 'Self-care / daily living', 'Sleep', 'Concentration / decision-making', 'Physical health', 'Safety', 'Finances / housing', 'Legal'];

const CPT_CODES = [
  ['90791', 'Psychiatric diagnostic evaluation'],
  ['90832', 'Psychotherapy, 30 min (16–37)'],
  ['90834', 'Psychotherapy, 45 min (38–52)'],
  ['90837', 'Psychotherapy, 60 min (53+)'],
  ['90839', 'Crisis psychotherapy, first 60 min (30–74)'],
  ['90846', 'Family psychotherapy without patient'],
  ['90847', 'Family / couples psychotherapy with patient'],
  ['90853', 'Group psychotherapy'],
];

const PROGRESS_OPTS = ['Not addressed this session', 'Regression', 'No progress', 'Minimal progress', 'Moderate progress', 'Significant progress', 'Goal met'];

const SUBJECTIVE_STARTERS = [
  'Client reported that since the last session,',
  'Client described ',
  'Client identified the main focus for today as ',
  'Client reported sleep, appetite, and energy as ',
  'Client reported substance use since last session: ',
];
