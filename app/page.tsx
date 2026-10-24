"use client";

import { useEffect, useState } from "react";

type Finding = {
  id: string;
  label: string;
  explanation: string;
};

type ActionChoice = {
  id: string;
  label: string;
  feedback: string;
};

type TrainingCase = {
  id: string;
  title: string;
  focus: string;
  level: string;
  summary: string;
  chart: string[];
  findings: Finding[];
  correctFindingIds: string[];
  actions: ActionChoice[];
  correctActionId: string;
  sourceTitle: string;
  sourceUrl: string;
};

const trainingCases: TrainingCase[] = [
  {
    id: "txa-route",
    title: "The Route Mismatch",
    focus: "Tranexamic acid injection",
    level: "ADVANCED",
    summary:
      "During a simulated handoff, an injectable product appears on a procedural order with a route that does not match the FDA safety reference.",
    chart: [
      "Fictional case · Procedure room handoff",
      "Product listed: tranexamic acid injection",
      "Procedure note mentions a neuraxial / spinal route",
      "The medication order and procedure note conflict",
      "No clarification is documented",
    ],
    findings: [
      {
        id: "route",
        label: "The order and procedure route conflict",
        explanation:
          "The case contains a route mismatch. The FDA warns about inadvertent neuraxial administration of tranexamic acid injection and says it should be administered only intravenously.",
      },
      {
        id: "verification",
        label: "Product and route need clarification before proceeding",
        explanation:
          "When the order and procedural documentation conflict, the mismatch needs to be clarified through the appropriate local workflow before the simulated order proceeds.",
      },
      {
        id: "allergy",
        label: "A documented allergy conflict",
        explanation:
          "No allergy information is given in this case, so the record does not support this finding.",
      },
    ],
    correctFindingIds: ["route", "verification"],
    actions: [
      {
        id: "pause-clarify",
        label: "Pause the simulated workflow and clarify the product and route with the responsible care team.",
        feedback:
          "Correct. This response addresses the mismatch and uses a clarification pathway rather than guessing.",
      },
      {
        id: "assume",
        label: "Assume the procedure note is correct and continue.",
        feedback:
          "That leaves a known conflict unresolved. The training objective is to recognize and escalate the mismatch.",
      },
      {
        id: "edit",
        label: "Change the route based on memory without contacting the care team.",
        feedback:
          "Changing a disputed order based on memory is not a safe resolution. Clarify using the responsible local process.",
      },
    ],
    correctActionId: "pause-clarify",
    sourceTitle: "FDA safety alert: tranexamic acid injection route errors",
    sourceUrl:
      "https://www.fda.gov/drugs/drug-alerts-and-statements/fda-alerts-health-care-professionals-about-risk-medication-errors-tranexamic-acid-injection-resulting",
  },
  {
    id: "glp1-product",
    title: "The Unclear Product",
    focus: "Compounded GLP-1 product record",
    level: "CURRENT TOPIC",
    summary:
      "A fictional referral record describes a compounded GLP-1 product, but the product details and source information are incomplete.",
    chart: [
      "Fictional case · Outpatient medication review",
      "Product described as compounded semaglutide",
      "The record does not show the product concentration",
      "The source / compounder is not identified in the file",
      "A marketing page describes it as the same as an approved product",
    ],
    findings: [
      {
        id: "concentration",
        label: "Product concentration is missing from the record",
        explanation:
          "The record does not identify concentration. FDA has described dosing errors involving compounded GLP-1 products, including errors involving dose calculations and measurement.",
      },
      {
        id: "source",
        label: "Product source and identity need verification",
        explanation:
          "The source and exact product identity are unclear. FDA has raised concerns about misleading claims that unapproved compounded products are the same as FDA-approved products.",
      },
      {
        id: "overdose",
        label: "The record proves an overdose occurred",
        explanation:
          "The case does not establish that an overdose occurred. Do not infer an outcome that is not documented.",
      },
    ],
    correctFindingIds: ["concentration", "source"],
    actions: [
      {
        id: "verify-record",
        label: "Do not infer equivalence. Verify the exact product and documentation through the responsible pharmacist / prescriber workflow.",
        feedback:
          "Correct. The case is about incomplete product information and unsupported equivalence claims, not making assumptions.",
      },
      {
        id: "treat-same",
        label: "Treat it as interchangeable because the marketing page says it is the same.",
        feedback:
          "A marketing statement is not enough to establish product equivalence. The case requires verification of the actual product and record.",
      },
      {
        id: "calculate",
        label: "Estimate the missing concentration from the intended amount.",
        feedback:
          "Do not calculate from missing information. The simulated record needs clarification through the proper workflow.",
      },
    ],
    correctActionId: "verify-record",
    sourceTitle: "FDA concerns with unapproved GLP-1 drugs",
    sourceUrl:
      "https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss",
  },
  {
    id: "insulin-handoff",
    title: "The Handoff Discrepancy",
    focus: "Insulin medication history",
    level: "HIGH-ALERT",
    summary:
      "A fictional admission medication history and a new order contain different timing information for insulin. The chart does not say which source was confirmed.",
    chart: [
      "Fictional case · Hospital admission review",
      "Medication history: insulin timing documented by the patient",
      "New order: timing differs from the medication history",
      "No note identifies who confirmed the intended regimen",
      "Insulin is listed by ISMP as a high-alert medication",
    ],
    findings: [
      {
        id: "discrepancy",
        label: "Medication history and new order do not agree",
        explanation:
          "The timing differs between two records and the chart does not show how the intended information was confirmed.",
      },
      {
        id: "high-alert",
        label: "This involves a high-alert medication",
        explanation:
          "ISMP includes subcutaneous and intravenous insulin on its high-alert medication list. The case calls for careful verification under local policy.",
      },
      {
        id: "renal",
        label: "The case documents a renal-dose issue",
        explanation:
          "No renal information is provided, so this finding is not supported by the case.",
      },
    ],
    correctFindingIds: ["discrepancy", "high-alert"],
    actions: [
      {
        id: "reconcile",
        label: "Reconcile the conflicting sources and confirm the intended information with the appropriate care team before resolving the simulated order.",
        feedback:
          "Correct. The discrepancy is not resolved by choosing one source without confirmation.",
      },
      {
        id: "choose-new",
        label: "Use the new order automatically because it is the most recent entry.",
        feedback:
          "The record does not explain the discrepancy. Recency alone does not resolve conflicting medication-history information.",
      },
      {
        id: "choose-history",
        label: "Use the home medication history automatically.",
        feedback:
          "The history is one source, but the chart still contains an unresolved conflict. Follow the local reconciliation process.",
      },
    ],
    correctActionId: "reconcile",
    sourceTitle: "ISMP list of high-alert medications in acute care",
    sourceUrl:
      "https://www.ismp.org/system/files/resources/2024-01/ISMP_HighAlert_AcuteCare_List_010924_MS5760.pdf",
  },
];

const STORAGE_KEY = "pharmsim-pro-progress";

export default function Home() {
  const [caseId, setCaseId] = useState(trainingCases[0].id);
  const [selectedFindings, setSelectedFindings] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [caseScores, setCaseScores] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);

  const activeCase =
    trainingCases.find((trainingCase) => trainingCase.id === caseId) ??
    trainingCases[0];

  const correctFlagCount = selectedFindings.filter((id) =>
    activeCase.correctFindingIds.includes(id),
  ).length;
  const missedCount =
    activeCase.correctFindingIds.length - correctFlagCount;
  const actionCorrect = selectedAction === activeCase.correctActionId;
  const totalScore = Object.values(caseScores).reduce(
    (sum, score) => sum + score,
    0,
  );
  const completedCount = Object.keys(caseScores).length;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.caseScores && typeof data.caseScores === "object") {
          setCaseScores(data.caseScores);
        }
      }
    } catch {
      setCaseScores({});
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ caseScores }));
    }
  }, [caseScores, loaded]);

  function selectCase(id: string) {
    setCaseId(id);
    setSelectedFindings([]);
    setSelectedAction("");
    setSubmitted(false);
  }

  function toggleFinding(id: string) {
    if (submitted) return;
    setSelectedFindings((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function submitReview() {
    if (submitted || !selectedAction) return;
    const points = correctFlagCount + (actionCorrect ? 1 : 0);
    setCaseScores((current) => ({ ...current, [activeCase.id]: points }));
    setSubmitted(true);
  }

  function tryAgain() {
    setSelectedFindings([]);
    setSelectedAction("");
    setSubmitted(false);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a href="#" className="brand">
          <span className="brand-mark">P</span>
          <span>PharmSim <small>PRO</small></span>
        </a>

        <div className="sidebar-label">TRAINING</div>
        <div className="sidebar-link active"><span>▦</span> Decision lab</div>
        <div className="sidebar-link"><span>◷</span> Progress</div>
        <div className="sidebar-link"><span>⌕</span> Drug references</div>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span>✳</span>
            <strong>Practice mode</strong>
            <p>All patient and medication records in this lab are fictional.</p>
          </div>
          <div className="profile">
            <span className="avatar">S</span>
            <span><strong>Student workspace</strong><small>Pharmacy learner</small></span>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="breadcrumb">Pharmacy training <span>/</span> Medication safety lab</div>
          <div className="top-meta"><span className="live-dot" /> LOCAL PRACTICE SESSION</div>
        </header>

        <div className="content">
          <section className="hero">
            <div>
              <p className="eyebrow">CLINICAL REASONING · SIMULATED CASES</p>
              <h1>Think clearly when<br /><em>the details matter.</em></h1>
              <p className="hero-copy">
                Review the medication record, identify safety concerns, and
                choose a next step you can explain.
              </p>
            </div>
            <div className="score-card">
              <span className="score-caption">SESSION SCORE</span>
              <strong>{totalScore}<small> XP</small></strong>
              <div className="score-divider" />
              <span className="score-caption">{completedCount} of {trainingCases.length} cases reviewed</span>
              <div className="score-track">
                <span style={{ width: `${(completedCount / trainingCases.length) * 100}%` }} />
              </div>
            </div>
          </section>

          <section className="case-tabs" aria-label="Choose a training case">
            {trainingCases.map((trainingCase, index) => {
              const done = caseScores[trainingCase.id] !== undefined;
              return (
                <button
                  key={trainingCase.id}
                  className={caseId === trainingCase.id ? "case-tab active" : "case-tab"}
                  onClick={() => selectCase(trainingCase.id)}
                  aria-pressed={caseId === trainingCase.id}
                >
                  <span className="tab-index">0{index + 1}</span>
                  <span className="tab-copy">
                    <strong>{trainingCase.title}</strong>
                    <small>{done ? "Reviewed" : trainingCase.level}</small>
                  </span>
                  {done && <span className="done-check">✓</span>}
                </button>
              );
            })}
          </section>

          <section className="case-header">
            <div>
              <span className="case-focus">{activeCase.focus}</span>
              <h2>{activeCase.title}</h2>
              <p>{activeCase.summary}</p>
            </div>
            <span className="level-badge">{activeCase.level}</span>
          </section>

          <section className="workspace">
            <article className="panel record-panel">
              <div className="panel-heading">
                <span className="panel-icon">▤</span>
                <div><small>SIMULATED CHART</small><h3>Review the record</h3></div>
              </div>
              <div className="record-stamp">
                <span>TRAINING ONLY</span><span>CASE {activeCase.id.toUpperCase()}</span>
              </div>
              <ul className="record-list">
                {activeCase.chart.map((line, index) => (
                  <li key={`${activeCase.id}-${index}`}>
                    <span className="record-bullet" />{line}
                  </li>
                ))}
              </ul>
              <div className="workflow-note">
                <strong>YOUR TASK</strong>
                <p>
                  Select every supported safety finding, then choose the most
                  appropriate workflow response for this simulation.
                </p>
              </div>
              <a
                className="source-link"
                href={activeCase.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span>REFERENCE</span>
                <strong>{activeCase.sourceTitle}</strong>
                <span className="external">↗</span>
              </a>
            </article>

            <article className="panel decision-panel">
              <div className="panel-heading">
                <span className="panel-icon green">⌕</span>
                <div><small>STEP 01 · IDENTIFY</small><h3>What should be flagged?</h3></div>
              </div>

              <div className="finding-list">
                {activeCase.findings.map((finding) => {
                  const checked = selectedFindings.includes(finding.id);
                  const isCorrect =
                    activeCase.correctFindingIds.includes(finding.id);
                  return (
                    <div
                      key={finding.id}
                      className={`finding ${checked ? "selected" : ""} ${
                        submitted && isCorrect ? "correct" : ""
                      } ${submitted && checked && !isCorrect ? "incorrect" : ""}`}
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={submitted}
                          onChange={() => toggleFinding(finding.id)}
                        />
                        <span className="checkmark">{checked ? "✓" : ""}</span>
                        <span>{finding.label}</span>
                      </label>
                      {submitted && (
                        <p className="feedback">{finding.explanation}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="action-heading">
                <small>STEP 02 · RESPOND</small>
                <h3>Choose your next step</h3>
              </div>
              <div className="action-list">
                {activeCase.actions.map((action) => (
                  <label
                    className={`action-option ${
                      selectedAction === action.id ? "chosen" : ""
                    } ${
                      submitted && action.id === activeCase.correctActionId
                        ? "answer"
                        : ""
                    }`}
                    key={action.id}
                  >
                    <input
                      type="radio"
                      name={`action-${activeCase.id}`}
                      value={action.id}
                      checked={selectedAction === action.id}
                      disabled={submitted}
                      onChange={() => setSelectedAction(action.id)}
                    />
                    <span className="radio-mark" />
                    <span>{action.label}</span>
                  </label>
                ))}
              </div>

              {submitted && (
                <div className={actionCorrect ? "result-box good-result" : "result-box"}>
                  <strong>{actionCorrect ? "Good workflow choice" : "Review the workflow"}</strong>
                  <p>
                    {activeCase.actions.find((action) => action.id === selectedAction)?.feedback}
                  </p>
                  <p className="score-result">
                    Findings: {correctFlagCount}/{activeCase.correctFindingIds.length}
                    {" · "}
                    Response: {actionCorrect ? "correct" : "review"}
                    {" · "}
                    Case points: {caseScores[activeCase.id]}
                  </p>
                </div>
              )}

              <div className="decision-footer">
                {!submitted ? (
                  <button
                    className="submit-button"
                    onClick={submitReview}
                    disabled={!selectedAction}
                  >
                    Submit case review <span>→</span>
                  </button>
                ) : (
                  <button className="retry-button" onClick={tryAgain}>
                    Try this case again
                  </button>
                )}
                {!submitted && (
                  <span className="scoring-hint">
                    {missedCount > 0
                      ? "Select findings and a response to continue"
                      : "Case points are awarded after review"}
                  </span>
                )}
              </div>
            </article>
          </section>

          <footer className="footer">
            <strong>PharmSim Pro · Medication Safety Decision Lab</strong>
            <span>
              Educational simulation only. Not for patient care, dispensing, or
              treatment decisions. Follow current local policies and references.
            </span>
            <span>
              Content references: FDA and ISMP. This project is not endorsed by those organizations.
            </span>
          </footer>
        </div>
      </div>
    </main>
  );
}