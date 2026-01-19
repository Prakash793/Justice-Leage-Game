
import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle, XCircle, ChevronRight, Zap, Shield, Pause, Play, Trophy, Rocket, RefreshCcw, GraduationCap } from 'lucide-react';
import { generateLegalQuiz } from '../services/gemini';
import { QuizQuestion } from '../types';
import { OFFLINE_QUIZ } from '../data/localContent';

interface QuizProps {
  onComplete: (score: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Function to shuffle array and pick N items
  const getShuffledSet = (arr: QuizQuestion[], count: number = 5) => {
    return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const startQuiz = async (selectedTopic: string) => {
    setLoading(true);
    setTopic(selectedTopic);
    try {
      let q: QuizQuestion[] = [];
      if (navigator.onLine) {
        // Try online generation first
        q = await generateLegalQuiz(selectedTopic);
      }
      
      // Fallback or combine with offline pool for variety
      if (q.length === 0 && OFFLINE_QUIZ[selectedTopic]) {
        q = getShuffledSet(OFFLINE_QUIZ[selectedTopic], 10); // Pick 10 for more depth
      }

      setQuestions(q);
      setCurrentIndex(0);
      setScore(0);
      setTimeLeft(60);
      setShowResults(false);
      setIsAnswered(false);
      setIsPaused(false);
    } catch (e) {
      console.error(e);
      if (OFFLINE_QUIZ[selectedTopic]) {
        setQuestions(getShuffledSet(OFFLINE_QUIZ[selectedTopic], 10));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questions.length > 0 && timeLeft > 0 && !showResults && !isAnswered && !isPaused) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered && questions.length > 0) {
      handleAnswer(-1);
    }
  }, [timeLeft, questions, showResults, isAnswered, isPaused]);

  const handleAnswer = (index: number) => {
    if (isAnswered || isPaused) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === questions[currentIndex].correctAnswer) {
      setScore(score + 10);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(60);
      setIsPaused(false);
    } else {
      setShowResults(true);
      onComplete(score);
    }
  };

  if (!topic) {
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="text-center">
          <div className="w-24 h-24 bg-gold/10 border border-gold/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl relative">
            <GraduationCap className="w-12 h-12 text-gold" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Bar Exam Trials</h1>
          <p className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mt-2 opacity-60">AIBE Prep Protocol • Season 1</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {Object.keys(OFFLINE_QUIZ).map((t) => (
            <button
              key={t}
              onClick={() => startQuiz(t)}
              className="p-6 glass border border-white/5 rounded-[2rem] flex items-center justify-between hover:bg-white/10 transition-all active:scale-95 group"
            >
              <div className="flex items-center space-x-5">
                <div className="p-4 bg-white/5 border border-white/10 text-gold rounded-2xl group-hover:bg-gold group-hover:text-black transition-colors">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-white text-lg block tracking-tight">{t}</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {OFFLINE_QUIZ[t].length}+ Local Trials • Day 1
                  </span>
                </div>
              </div>
              <ChevronRight className="text-gold opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
        <div className="p-6 rounded-[2rem] bg-gold/5 border border-gold/10 text-center">
            <p className="text-[10px] text-gold font-bold uppercase tracking-widest leading-relaxed">
              New questions are synchronized daily. <br/>Complete all trials to achieve 'Supreme Counsel' status.
            </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-8">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-gold/10 rounded-full"></div>
          <div className="w-24 h-24 border-4 border-gold border-t-transparent rounded-full animate-spin absolute top-0"></div>
          <Rocket className="w-10 h-10 text-gold absolute top-7 left-7 animate-bounce" />
        </div>
        <p className="text-gold font-black uppercase tracking-[0.3em] text-sm">Compiling Legal Database...</p>
      </div>
    );
  }

  if (showResults) {
    const totalPossible = questions.length * 10;
    const percentage = (score / totalPossible) * 100;
    const rank = percentage >= 80 ? 'SUPREME COUNSEL' : percentage >= 50 ? 'SENIOR ADVOCATE' : 'JUNIOR COUNSEL';
    
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[85vh] space-y-12 animate-in zoom-in fade-in duration-700">
        <div className="relative group">
          <div className="absolute -inset-8 bg-gold/10 rounded-full blur-[80px] group-hover:bg-gold/20 transition-all animate-pulse"></div>
          <div className="h-64 w-64 rounded-[4rem] bg-[#1e293b] border-4 border-gold/30 flex flex-col items-center justify-center shadow-3xl relative rotate-3">
            <Trophy className="absolute -top-10 -right-10 w-20 h-20 text-gold drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gold text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl whitespace-nowrap border-4 border-[#0f172a]">
              {rank}
            </div>
            <p className="text-[12px] text-gold font-black uppercase tracking-[0.4em] mb-2 opacity-50">Trial Performance</p>
            <p className="text-8xl font-black text-white tracking-tighter">{score}</p>
          </div>
        </div>

        <div className="space-y-6 w-full max-w-xs">
          <h2 className="text-4xl font-serif font-bold text-white">Trial Accomplished</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 rounded-3xl border border-white/5 text-center">
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Accuracy</p>
               <p className="text-2xl font-black text-gold">{percentage}%</p>
            </div>
            <div className="glass p-4 rounded-3xl border border-white/5 text-center">
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Correct</p>
               <p className="text-2xl font-black text-green-400">{score/10}/{questions.length}</p>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button onClick={() => setTopic(null)} className="w-full bg-gold text-slate-900 p-6 rounded-[2.5rem] font-black shadow-3xl uppercase tracking-[0.3em] text-xs">
            Return to Hub
          </button>
          <button onClick={() => startQuiz(topic!)} className="w-full glass text-white p-5 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px]">
            <RefreshCcw className="w-4 h-4 inline mr-2" /> Retake Trial
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-[2rem] border border-white/5 shadow-inner">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex flex-col items-center justify-center font-black text-gold shadow-lg">
            <span className="text-[8px] opacity-60">Trial</span>
            <span className="text-xl leading-none">{currentIndex + 1}</span>
          </div>
          <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden border border-white/5">
             <div className="h-full bg-gold shadow-[0_0_10px_rgba(251,191,36,0.6)]" style={{width: `${((currentIndex + 1) / questions.length) * 100}%`}}></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
           <button onClick={() => setIsPaused(!isPaused)} className={`p-4 rounded-2xl border transition-all ${isPaused ? 'bg-gold border-gold text-black shadow-3xl scale-110' : 'bg-white/5 border-white/10 text-slate-400'}`}>
             {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5" />}
           </button>
           <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border ${timeLeft < 15 && !isPaused ? 'bg-red-500/20 border-red-500/40 text-red-500 shadow-xl' : 'bg-white/5 border-white/10 text-gold'}`}>
             <Timer className="w-4 h-4 mb-0.5" />
             <span className="font-black text-xs tabular-nums tracking-tighter">{timeLeft}S</span>
           </div>
        </div>
      </div>

      <div className="relative">
        {isPaused && (
          <div className="absolute inset-0 z-50 glass-dark rounded-[3rem] flex flex-col items-center justify-center border border-white/10">
            <Pause className="w-12 h-12 text-gold mb-4 shadow-3xl" />
            <p className="text-gold font-black uppercase tracking-[0.5em] text-xs">Neural Sync Paused</p>
            <button onClick={() => setIsPaused(false)} className="mt-8 px-10 py-4 bg-gold text-black rounded-3xl text-xs font-black uppercase tracking-[0.2em] shadow-3xl border-2 border-white/20">
              Resume Trial
            </button>
          </div>
        )}

        <div className={`glass p-10 rounded-[3rem] shadow-2xl transition-all duration-500 ${isPaused ? 'blur-2xl opacity-10 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-1 w-6 bg-gold rounded-full"></div>
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">{currentQ.lawSection || 'Module Investigation'}</span>
          </div>
          <h3 className="text-xl font-bold text-white leading-relaxed tracking-tight">{currentQ.question}</h3>
        </div>
      </div>

      <div className={`space-y-3.5 transition-all duration-500 ${isPaused ? 'blur-lg opacity-5 pointer-events-none' : 'opacity-100'}`}>
        {currentQ.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={isAnswered || isPaused}
            className={`w-full p-6 rounded-3xl text-left text-[13px] font-bold transition-all border flex justify-between items-center shadow-xl transform active:scale-[0.97] ${
              isAnswered
                ? i === currentQ.correctAnswer
                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                  : i === selectedOption
                  ? 'bg-red-500/20 border-red-500/50 text-red-400'
                  : 'bg-white/5 border-white/5 text-slate-700 opacity-50'
                : 'bg-white/5 border-white/10 hover:border-gold/50 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="tracking-tight leading-relaxed pr-6">{opt}</span>
            <div className="shrink-0">
              {isAnswered && i === currentQ.correctAnswer && <CheckCircle className="w-5 h-5" />}
              {isAnswered && i === selectedOption && i !== currentQ.correctAnswer && <XCircle className="w-5 h-5" />}
              {!isAnswered && <div className="w-6 h-6 rounded-full border-2 border-white/10" />}
            </div>
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-12">
          <div className="glass p-10 rounded-[3rem] border border-white/10 relative shadow-2xl overflow-hidden">
             <div className="absolute -top-3 left-10 bg-gold px-6 py-1.5 rounded-full text-[9px] font-black text-black uppercase tracking-[0.3em] shadow-xl">
               Legal Rationale
             </div>
            <p className="text-[13px] text-slate-300 leading-relaxed font-medium mb-8 mt-4">{currentQ.explanation}</p>
            {currentQ.tamilExplanation && (
              <p className="text-[12px] text-gold/90 font-bold italic border-t border-white/10 pt-6 leading-relaxed">
                {currentQ.tamilExplanation}
              </p>
            )}
          </div>
          <button onClick={nextQuestion} className="w-full bg-white text-slate-900 p-7 rounded-[3rem] font-black shadow-3xl flex items-center justify-center space-x-4 uppercase tracking-[0.3em] text-xs hover:bg-gold transition-all active:scale-95 group">
            <span>{currentIndex === questions.length - 1 ? 'Evaluate Results' : 'Next Question'}</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};
