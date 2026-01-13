
import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle, XCircle, ChevronRight, BookOpen, AlertCircle, Zap, Shield, Target, Pause, Play, Rocket, Award, Trophy } from 'lucide-react';
import { generateLegalQuiz } from '../services/gemini';
import { QuizQuestion } from '../types';

export const Quiz: React.FC = () => {
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

  const startQuiz = async (selectedTopic: string) => {
    setLoading(true);
    setTopic(selectedTopic);
    try {
      const q = await generateLegalQuiz(selectedTopic);
      setQuestions(q);
      setCurrentIndex(0);
      setScore(0);
      setTimeLeft(60);
      setShowResults(false);
      setIsAnswered(false);
      setIsPaused(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questions.length > 0 && timeLeft > 0 && !showResults && !isAnswered && !isPaused) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
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
    }
  };

  if (!topic) {
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="text-center">
          <div className="w-24 h-24 bg-gold/10 border border-gold/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl relative group">
            <Zap className="w-12 h-12 text-gold group-hover:scale-125 transition-transform" />
            <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full -z-10 animate-pulse"></div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Trials of Wisdom</h1>
          <p className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mt-2 opacity-60">Verification Sequence Ready</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {['Constitutional Law', 'Evidence Act', 'Contract Law', 'Criminal Procedure'].map((t) => (
            <button
              key={t}
              onClick={() => startQuiz(t)}
              className="p-6 glass border border-white/5 rounded-[2rem] flex items-center justify-between hover:bg-white/10 transition-all group active:scale-95"
            >
              <div className="flex items-center space-x-5">
                <div className="p-4 bg-white/5 border border-white/10 text-gold rounded-2xl group-hover:bg-gold/10 transition-colors">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-white text-lg block tracking-tight">{t}</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">5 Assessment Units</span>
                </div>
              </div>
              <ChevronRight className="text-gold opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gold/20 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-gold border-t-transparent rounded-full animate-spin absolute top-0"></div>
          <Rocket className="w-8 h-8 text-gold absolute top-6 left-6 animate-bounce" />
        </div>
        <div className="text-center">
          <p className="text-gold font-black uppercase tracking-[0.3em] text-xs">Decrypting Vaults</p>
          <p className="text-slate-500 text-[10px] font-bold mt-1">Downloading Assessment Protocols...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = (score / (questions.length * 10)) * 100;
    const rank = percentage >= 80 ? 'SUPREME COUNSEL' : percentage >= 50 ? 'SENIOR ADVOCATE' : 'JUNIOR COUNSEL';
    
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[85vh] space-y-10 animate-in zoom-in fade-in duration-700">
        <div className="relative mb-4">
          <div className="h-60 w-60 rounded-[4rem] bg-gold/5 border-4 border-gold/20 flex flex-col items-center justify-center shadow-3xl relative rotate-3 animate-pulse">
            <Trophy className="absolute -top-8 -right-8 w-16 h-16 text-gold drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gold text-black px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl">
              {rank}
            </div>
            <p className="text-[12px] text-gold font-black uppercase tracking-[0.4em] mb-2 opacity-60">Victory Points</p>
            <p className="text-8xl font-black text-white tracking-tighter">{score}</p>
          </div>
          <div className="absolute -z-10 inset-0 bg-gold/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="space-y-4 max-w-xs">
          <h2 className="text-4xl font-serif font-bold text-white">Trial Accomplished</h2>
          <div className="flex items-center justify-center space-x-6 py-4 border-y border-white/5">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase">Correct</p>
              <p className="text-xl font-bold text-green-400">{score/10}</p>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase">Accuracy</p>
              <p className="text-xl font-bold text-gold">{percentage}%</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm font-medium leading-relaxed pt-2">
            Protocol sync successful. Your data has been uploaded to the Justice League archives.
          </p>
        </div>

        <button 
          onClick={() => setTopic(null)}
          className="w-full bg-gold text-slate-900 p-6 rounded-[2.5rem] font-black shadow-2xl uppercase tracking-[0.4em] text-xs active:scale-95 transition-all flex items-center justify-center space-x-3"
        >
          <Target className="w-5 h-5" />
          <span>Return to Hub</span>
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-gold text-sm shadow-inner">
            {currentIndex + 1}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between w-24">
               <span className="text-[8px] font-black text-slate-500 uppercase">Trial Sync</span>
               <span className="text-[8px] font-black text-gold uppercase">{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden border border-white/5">
               <div 
                className="h-full bg-gold transition-all duration-700 shadow-[0_0_10px_rgba(251,191,36,0.5)]" 
                style={{width: `${((currentIndex + 1) / questions.length) * 100}%`}}
               ></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
           <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`p-3 rounded-2xl border transition-all ${isPaused ? 'bg-gold border-gold text-black shadow-lg scale-110' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
           >
             {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5" />}
           </button>
           <div className={`flex items-center space-x-3 px-5 py-3 rounded-2xl border ${timeLeft < 15 ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-lg shadow-red-500/10' : 'bg-white/5 border-white/10 text-gold'}`}>
             <Timer className={`w-4 h-4 ${timeLeft < 15 && !isPaused ? 'animate-pulse' : ''}`} />
             <span className="font-black text-sm tabular-nums tracking-wider">{timeLeft}s</span>
           </div>
        </div>
      </div>

      <div className="relative">
        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 z-20 glass-dark rounded-[2.5rem] flex flex-col items-center justify-center border border-white/10 animate-in fade-in duration-300">
            <div className="p-6 rounded-full bg-gold/10 border border-gold/20 mb-4">
              <Pause className="w-10 h-10 text-gold" />
            </div>
            <p className="text-gold font-black uppercase tracking-[0.4em] text-xs">Neural Sync Paused</p>
            <button 
              onClick={() => setIsPaused(false)}
              className="mt-6 px-8 py-3 bg-gold text-black rounded-full text-xs font-black uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-xl"
            >
              Resume Trial
            </button>
          </div>
        )}

        {/* Question Card */}
        <div className={`glass p-8 rounded-[2.5rem] relative overflow-hidden transition-all duration-500 ${isPaused ? 'blur-md opacity-20' : 'opacity-100'}`}>
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Target className="w-20 h-20" />
          </div>
          <h3 className="text-xl font-bold text-white leading-relaxed relative z-10 tracking-tight">{currentQ.question}</h3>
        </div>
      </div>

      <div className={`space-y-3 transition-all duration-500 ${isPaused ? 'blur-sm opacity-10 pointer-events-none' : 'opacity-100'}`}>
        {currentQ.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={isAnswered || isPaused}
            className={`w-full p-6 rounded-3xl text-left text-xs font-bold transition-all border flex justify-between items-center shadow-lg transform active:scale-[0.98] ${
              isAnswered
                ? i === currentQ.correctAnswer
                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                  : i === selectedOption
                  ? 'bg-red-500/20 border-red-500/50 text-red-400'
                  : 'bg-white/5 border-white/5 text-slate-700'
                : 'bg-white/5 border-white/10 hover:border-gold/50 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="tracking-tight leading-relaxed pr-4">{opt}</span>
            <div className="shrink-0">
              {isAnswered && i === currentQ.correctAnswer && <CheckCircle className="w-6 h-6" />}
              {isAnswered && i === selectedOption && i !== currentQ.correctAnswer && <XCircle className="w-6 h-6" />}
              {!isAnswered && <div className="w-6 h-6 rounded-full border border-white/10" />}
            </div>
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 relative">
             <div className="absolute -top-3 left-8 bg-gold px-4 py-1 rounded-full text-[8px] font-black text-black uppercase tracking-widest">
               Protocol Details
             </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium mb-6 mt-2">{currentQ.explanation}</p>
            {currentQ.tamilExplanation && (
              <div className="pt-4 border-t border-white/5">
                <p className="text-[11px] text-gold/90 font-bold italic tracking-tight leading-relaxed">
                  {currentQ.tamilExplanation}
                </p>
              </div>
            )}
            <div className="mt-8 flex items-center justify-between">
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                 <span className="text-[9px] font-black text-white uppercase tracking-widest">{currentQ.lawSection}</span>
               </div>
               <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[9px] font-black text-slate-500 uppercase">
                 +10 XP
               </div>
            </div>
          </div>
          <button
            onClick={nextQuestion}
            className="w-full bg-white text-slate-900 p-6 rounded-[2.5rem] font-black shadow-2xl flex items-center justify-center space-x-3 uppercase tracking-[0.3em] text-xs hover:bg-gold transition-all active:scale-95 group"
          >
            <span>{currentIndex === questions.length - 1 ? 'End Trial' : 'Initialize Next'}</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};
