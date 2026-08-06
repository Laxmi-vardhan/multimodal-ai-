import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FlashcardDeck = ({ flashcards = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState({});

  if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) {
    return (
      <div className="p-8 rounded-2xl glass-card text-center text-slate-400">
        No flashcards generated for this report yet.
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const toggleMastered = (e) => {
    e.stopPropagation();
    setMasteredCards((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex]
    }));
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header Info */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-indigo-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          Flashcard {currentIndex + 1} of {flashcards.length}
        </span>

        <button
          onClick={toggleMastered}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
            masteredCards[currentIndex]
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{masteredCards[currentIndex] ? 'Mastered' : 'Mark as Mastered'}</span>
        </button>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative h-72 w-full cursor-pointer perspective-1000 group"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, cubicBezier: [0.4, 0, 0.2, 1] }}
          className="w-full h-full transform-style-3d relative rounded-2xl glass-panel shadow-2xl border border-indigo-500/20"
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden p-8 flex flex-col justify-between items-center text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Question (Click to Flip)
            </span>
            <p className="text-lg font-bold text-slate-100 leading-snug">{currentCard.question}</p>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5" /> Click to reveal answer
            </span>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 flex flex-col justify-between items-center text-center gradient-bg-primary rounded-2xl text-white">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
              Answer Key
            </span>
            <p className="text-base font-semibold leading-relaxed">{currentCard.answer}</p>
            <span className="text-xs text-indigo-200 flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5" /> Click to flip back
            </span>
          </div>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="p-3 rounded-xl glass-card text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-xs text-slate-400">
          Mastered: {Object.values(masteredCards).filter(Boolean).length} / {flashcards.length}
        </span>

        <button
          onClick={handleNext}
          className="p-3 rounded-xl glass-card text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck;
