# TherapyBytes

A free, private, in-browser tool that helps clinicians write best-practice psychotherapy progress notes, guided by the client's **DSM-5-TR** diagnosis.

**Live site:** `https://<your-github-username>.github.io/Therapybytes/` (see "Publish on GitHub Pages" below)

## What it does

1. **Pick the diagnosis** (≈55 common DSM-5-TR diagnoses with ICD-10-CM code/specifier selection).
2. The app then tailors the rest of the note to that diagnosis:
   - symptom-status prompts (present / improved / worsened / not present vs. baseline)
   - evidence-based intervention options, each with a "what exactly did you do?" prompt
   - suggested standardized measures (PHQ-9, GAD-7, PCL-5, Y-BOCS, …)
   - example measurable (SMART) treatment goals
   - risk considerations, rule-outs, and diagnosis-specific documentation tips
3. **Guided steps:** session details (with CPT/time check) → diagnosis → client report → mental status & measures → risk → interventions & response → goals/progress/medical necessity → plan.
4. **Output formats:** SOAP, DAP, BIRP, GIRP, or narrative. Copy, download as `.txt`, or print.
5. **Quality check:** flags missing or weak elements (risk documentation, interventions without specifics, no client response, unsupported medical necessity, CPT/time mismatch, judgmental or vague wording, possible identifiers) and gives a completeness score.
6. **Next session** button carries over client, diagnoses, goals, and prior measure scores.

## Privacy

Everything runs client-side. There is no backend, analytics, or network request. Drafts are kept in your browser's `localStorage` only. **Do not enter names or other identifiers**; use a client ID/initials and paste the finished note into your EHR. Use *Clear all* on shared computers.

## Important limits

- This is a documentation aid, **not a diagnostic tool**. Symptom lists are short *paraphrased* prompts, not the DSM-5-TR criteria (which are copyrighted). Diagnose from the DSM-5-TR.
- Verify ICD-10-CM and CPT codes and time rules against current manuals and payer requirements.
- Suggestions are starting points; clinical judgment, supervision, your ethics code, and state law govern what belongs in a record. Not legal advice.

## Run locally

No build step or dependencies.

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

(Opening `index.html` directly from disk also works.)

## Publish on GitHub Pages

The site is plain static files at the repo root, so no workflow is needed:

1. Repo **Settings → Pages**
2. **Build and deployment → Source:** *Deploy from a branch*
3. **Branch:** choose the branch that contains these files (e.g. `main`) and folder **/ (root)** → Save.

The site will be live at `https://<user>.github.io/<repo>/` within a minute or two.

## Project layout

```
index.html        page shell
css/styles.css    styles (light/dark, responsive, print)
js/data.js        diagnoses, interventions, measures, goals, MSE/risk options
js/app.js         form steps, note generation, quality checks, persistence
```

To add or edit a diagnosis, add a `dx(...)` entry in `js/data.js`.
