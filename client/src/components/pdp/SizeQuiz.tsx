import { useState } from "react";
import { X } from "lucide-react";

interface SizeQuizProps {
  open: boolean;
  onClose: () => void;
  onResult?: (size: string) => void;
}

const STEPS = [
  {
    key: "age",
    title: "How old is she?",
    options: [
      { v: "1-2", label: "1–2 yrs" },
      { v: "3-4", label: "3–4 yrs" },
      { v: "5-6", label: "5–6 yrs" },
      { v: "7-8", label: "7–8 yrs" },
      { v: "9-10", label: "9–10 yrs" },
      { v: "11-12", label: "11–12 yrs" },
      { v: "13-14", label: "13–14 yrs" },
    ],
  },
  {
    key: "build",
    title: "How would you describe her build?",
    options: [
      { v: "petite", label: "Petite for her age" },
      { v: "average", label: "About average" },
      { v: "tall", label: "Tall for her age" },
    ],
  },
  {
    key: "fit",
    title: "How does she like denim to fit?",
    options: [
      { v: "snug", label: "Snug, fitted" },
      { v: "regular", label: "True to size" },
      { v: "relaxed", label: "Roomy and relaxed" },
    ],
  },
];

const AGE_TO_BASE: Record<string, string> = {
  "1-2": "1–2 Yrs",
  "3-4": "3–4 Yrs",
  "5-6": "5–6 Yrs",
  "7-8": "7–8 Yrs",
  "9-10": "9–10 Yrs",
  "11-12": "11–12 Yrs",
  "13-14": "13–14 Yrs",
};

const ORDER = ["1–2 Yrs", "3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs", "13–14 Yrs"];

function recommend(answers: Record<string, string>): string {
  const base = AGE_TO_BASE[answers.age ?? "5-6"];
  let idx = ORDER.indexOf(base);
  if (answers.build === "tall") idx = Math.min(idx + 1, ORDER.length - 1);
  if (answers.build === "petite") idx = Math.max(idx - 1, 0);
  if (answers.fit === "relaxed") idx = Math.min(idx + 1, ORDER.length - 1);
  if (answers.fit === "snug") idx = Math.max(idx - 1, 0);
  return ORDER[idx];
}

export function SizeQuiz({ open, onClose, onResult }: SizeQuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  if (!open) return null;
  const current = STEPS[step];
  const progress = (step / STEPS.length) * 100;
  const recommended = done ? recommend(answers) : null;

  function pick(v: string) {
    const next = { ...answers, [current.key]: v };
    setAnswers(next);
    if (step + 1 < STEPS.length) {
      setStep(step + 1);
    } else {
      setDone(true);
      const rec = recommend(next);
      onResult?.(rec);
    }
  }

  function reset() {
    setAnswers({});
    setStep(0);
    setDone(false);
  }

  return (
    <>
      <div onClick={onClose} className="sq-overlay" />
      <div role="dialog" aria-modal="true" aria-label="Find her perfect fit" className="sq-modal">
        <button type="button" aria-label="Close" onClick={onClose} className="sq-close">
          <X size={16} strokeWidth={1.5} />
        </button>

        {/* Progress */}
        <div style={{ height: "2px", background: "rgba(26,25,22,0.10)", marginBottom: "32px" }}>
          <div
            style={{
              height: "100%",
              width: `${done ? 100 : progress}%`,
              background: "var(--ink)",
              transition: "width 0.4s var(--ease-out)",
            }}
          />
        </div>

        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
          {done ? "Recommendation" : `Step ${step + 1} of ${STEPS.length}`}
        </p>

        {!done ? (
          <>
            <h3 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(24px, 3vw, 36px)", color: "var(--ink)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "24px" }}>
              {current.title}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px" }}>
              {current.options.map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => pick(o.v)}
                  className="sq-option"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px, 3.6vw, 44px)", color: "var(--ink)", lineHeight: 1, letterSpacing: "-0.03em", marginBottom: "12px" }}>
              We recommend
            </h3>
            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(56px, 8vw, 96px)", color: "var(--ink)", lineHeight: 1, letterSpacing: "-0.04em", marginBottom: "16px" }}>
              {recommended}
            </p>
            <p style={{ fontSize: "14px", color: "var(--ink-mute)", lineHeight: 1.6, marginBottom: "24px" }}>
              Based on her age, build, and how she likes denim to fit. The adjustable waistband
              gives roughly 4cm of give either way, so this is a confident pick.
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button type="button" onClick={onClose} className="btn btn-primary">Use this size</button>
              <button type="button" onClick={reset} className="btn btn-ghost">Try again</button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .sq-overlay {
          position: fixed; inset: 0;
          background: rgba(26,25,22,0.55);
          backdrop-filter: blur(6px);
          z-index: 92;
          animation: fadeIn 0.3s var(--ease-out);
        }
        .sq-modal {
          position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);
          width: min(560px, calc(100vw - 32px));
          background: var(--paper-soft);
          z-index: 93;
          padding: clamp(24px, 4vw, 40px);
          box-shadow: 0 30px 80px rgba(26,25,22,0.32);
          animation: welcomeIn 0.4s var(--ease-out);
        }
        .sq-close {
          position: absolute; top: 12px; right: 12px;
          width: 30px; height: 30px;
          display: inline-flex; align-items: center; justify-content: center;
          background: var(--paper-warm);
          border: 1px solid rgba(26,25,22,0.12);
          border-radius: 50%; cursor: pointer; color: var(--ink);
        }
        .sq-option {
          background: var(--paper);
          border: 1px solid rgba(26,25,22,0.18);
          padding: 14px 12px;
          font-family: var(--sans);
          font-size: 13px;
          letter-spacing: 0.06em;
          color: var(--ink);
          cursor: pointer;
          transition: all 0.22s var(--ease-out);
        }
        .sq-option:hover {
          background: var(--ink);
          color: var(--paper);
          border-color: var(--ink);
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}
