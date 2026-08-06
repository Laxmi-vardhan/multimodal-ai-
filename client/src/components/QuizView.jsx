import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle, XCircle, RotateCcw, Award, HelpCircle } from 'lucide-react';

const QuizView = ({ quiz = [] }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!quiz || !Array.isArray(quiz) || quiz.length === 0) {
    return (
      <div className="p-8 rounded-2xl glass-card text-center text-slate-400">
        No quiz questions generated for this report yet.
      </div>
    );
  }

  const handleSelect = (qIdx, option) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    if (score / quiz.length >= 0.7) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = calculateScore();
  const percentage = Math.round((score / quiz.length) * 100);

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Score Summary Box (when submitted) */}
      {submitted && (
        <div className="p-6 rounded-2xl glass-panel border border-indigo-500/30 text-center space-y-3 bg-gradient-to-br from-indigo-950/40 to-purple-950/40">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
          <h3 className="text-2xl font-extrabold text-white">Quiz Completed!</h3>
          <p className="text-xl font-bold gradient-text">
            Score: {score} / {quiz.length} ({percentage}%)
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl font-semibold text-white gradient-bg-primary shadow-lg inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Retake Quiz
          </button>
        </div>
      )}

      {/* Quiz Questions List */}
      <div className="space-y-6">
        {quiz.map((q, qIdx) => {
          const userSel = selectedAnswers[qIdx];
          const isCorrect = userSel === q.answer;

          return (
            <div key={qIdx} className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  Q{qIdx + 1}
                </span>
                <h4 className="text-base font-semibold text-slate-100">{q.question}</h4>
              </div>

              <div className="space-y-2">
                {q.options &&
                  q.options.map((opt, optIdx) => {
                    let optionStyle = 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-indigo-500/40';

                    if (userSel === opt) {
                      optionStyle = 'bg-indigo-600/30 border-indigo-500 text-white font-semibold';
                    }

                    if (submitted) {
                      if (opt === q.answer) {
                        optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold';
                      } else if (userSel === opt && opt !== q.answer) {
                        optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelect(qIdx, opt)}
                        disabled={submitted}
                        className={`w-full p-3.5 rounded-xl text-left text-sm border transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {submitted && opt === q.answer && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        {submitted && userSel === opt && opt !== q.answer && <XCircle className="w-4 h-4 text-rose-400" />}
                      </button>
                    );
                  })}
              </div>

              {submitted && q.explanation && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
                  <span className="font-semibold text-indigo-300 block mb-0.5">Explanation:</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selectedAnswers).length === 0}
          className="w-full py-4 rounded-xl font-bold text-white gradient-bg-primary hover:opacity-95 shadow-xl shadow-indigo-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <Award className="w-5 h-5" /> Submit Quiz Answers
        </button>
      )}
    </div>
  );
};

export default QuizView;
