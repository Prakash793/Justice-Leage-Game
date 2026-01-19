
import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle, XCircle, ChevronRight, Zap, Shield, Pause, Play, Trophy, Rocket, RefreshCcw, GraduationCap, Star, TrendingUp, Calendar, Lock } from 'lucide-react';
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

  // Logic for 'Daily Trial': Picks 10 questions based on the date so everyone gets same daily challenge
  const getDailySet = (arr: QuizQuestion[], count: number = 10) => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Cycle through questions based on day
    const startIndex = (dayOfYear * count) % arr.length;
    let set = [];
    for (let i = 0; i < count; i++) {
      set.push(arr[(startIndex + i) % arr.length]);
    }
    return set;
  };

  const startQuiz = async (selectedTopic: string) => {
    setLoading(true);
    setTopic(selectedTopic);
    try {
      let q: QuizQuestion[] = [];
      // Even if online, we stick to the 10-per-day limit for the daily challenge feel
      if (OFFLINE_QUIZ[selectedTopic]) {
        q = getDailySet(OFFLINE_QUIZ[selectedTopic], 10);
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
        setQuestions(getDailySet(OFFLINE_QUIZ[selectedTopic], 10));
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
          <div className="w-24 h-24 bg-gold/10 border border-gold/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl relative group">
            <GraduationCap className="w-12 h-12 text-gold group-hover:scale-110 transition-transform" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-full animate-bounce">NEW</div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Bar Exam Trials</h1>
          <p className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mt-2 opacity-60 flex items-center justify-center">
            <Calendar className="w-3 h-3 mr-2" />
            DAILY DOSE: 10 PER SUBJECT
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {Object.keys(OFFLINE_QUIZ).map((t) => (
            <button
              key={t}
              onClick={() => startQuiz(t)}
              className="p-6 glass border border-white/5 rounded-[2.5rem] flex items-center justify-between hover:bg-white/10 transition-all active:scale-95 group relative overflow-hidden"
            >
              <div className="flex items-center space-x-5 relative z-10">
                <div className="p-4 bg-white/5 border border-white/10 text-gold rounded-2xl group-hover:bg-gold group-hover:text-black transition-colors">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-white text-lg block tracking-tight">{t}</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                    <CheckCircle className="w-2.5 h-2.5 mr-1 text-gold/50" />
                    TODAY'S 10 TRIALS READY
                  </span>
                </div>
              </div>
              <ChevronRight className="text-gold opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all z-10" />
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 text-center space-y-3">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Step into tomorrow's trial after completion. <br/>Consistent effort leads to the Bar.
            </p>
            <div className="flex justify-center space-x-2">
               {[1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-gold shadow-[0_0_5px_gold]' : 'bg-slate-700 opacity-30'}`} />
               ))}
               <Lock className="w-2.5 h-2.5 text-slate-800" />
            </div>
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
        <p className="text-gold font-black uppercase tracking-[0.3em] text-sm">Drafting Legal Briefs...</p>
      </div>
    );
  }

  if (showResults) {
    const totalPossible = questions.length * 10;
    const percentage = (score / totalPossible) * 100;
    const rank = percentage >= 80 ? 'SUPREME COUNSEL' : percentage >= 50 ? 'SENIOR ADVOCATE' : 'JUNIOR COUNSEL';
    
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[85vh] space-y-10 animate-in zoom-in fade-in duration-700">
        <div className="relative group">
          <div className="absolute -inset-10 bg-gold/10 rounded-full blur-[100px] group-hover:bg-gold/20 transition-all"></div>
          <div className="h-64 w-64 rounded-[4rem] bg-[#1e293b] border-4 border-gold/30 flex flex-col items-center justify-center shadow-3xl relative rotate-3 hover:rotate-0 transition-transform">
            <Trophy className="absolute -top-10 -right-10 w-24 h-24 text-gold drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gold text-black px-10 py-3 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl border-4 border-[#0a192f] whitespace-nowrap">
              {rank}
            </div>
            <p className="text-[10px] text-gold font-black uppercase tracking-[0.4em] mb-2 opacity-50">Trial Score</p>
            <p className="text-8xl font-black text-white tracking-tighter">{score}</p>
          </div>
        </div>

        <div className="space-y-6 w-full max-w-sm">
          <div className="glass p-8 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-serif font-bold text-white">Trial Report</h2>
               <div className="px-3 py-1 bg-gold/20 border border-gold/30 rounded-full text-[8px] font-black text-gold uppercase tracking-widest">
                 Bar Standard: {percentage >= 40 ? 'PASS' : 'FAIL'}
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-3xl text-center border border-white/5">
                 <div className="flex items-center justify-center mb-1 space-x-1">
                    <Star className="w-3 h-3 text-gold fill-current" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Efficiency</span>
                 </div>
                 <p className="text-2xl font-black text-gold">{percentage}%</p>
              </div>
              <div className="bg-white/5 p-4 rounded-3xl text-center border border-white/5">
                 <div className="flex items-center justify-center mb-1 space-x-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Readiness</span>
                 </div>
                 <p className="text-2xl font-black text-green-400">{percentage >= 60 ? 'ELITE' : 'GROWING'}</p>
              </div>
            </div>
            <div className="pt-2">
               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold transition-all duration-1000" style={{width: `${percentage}%`}} />
               </div>
               <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mt-2">Advancement toward Next Day Trial: {percentage}%</p>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
          <button onClick={() => setTopic(null)} className="w-full bg-gold text-slate-900 p-6 rounded-[2.5rem] font-black shadow-3xl uppercase tracking-[0.3em] text-xs hover:bg-white transition-all transform hover:scale-[1.02] active:scale-95">
            Return to Court Hub
          </button>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            Step into Next Trial in 24:00:00
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-[2.5rem] border border-white/5">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex flex-col items-center justify-center font-black text-gold shadow-lg">
            <span className="text-[8px] opacity-60 uppercase">CASE</span>
            <span className="text-xl leading-none">{currentIndex + 1}</span>
          </div>
          <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden border border-white/5">
             <div className="h-full bg-gold shadow-[0_0_15px_rgba(251,191,36,0.6)] transition-all duration-700" style={{width: `${((currentIndex + 1) / questions.length) * 100}%`}}></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
           <button onClick={() => setIsPaused(!isPaused)} className={`p-4 rounded-2xl border transition-all ${isPaused ? 'bg-gold border-gold text-black scale-110 shadow-xl' : 'bg-white/5 border-white/10 text-slate-500'}`}>
             {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5" />}
           </button>
           <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border ${timeLeft < 15 && !isPaused ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse' : 'bg-white/5 border-white/10 text-gold'}`}>
             <span className="font-black text-xs tabular-nums tracking-tighter">{timeLeft}s</span>
           </div>
        </div>
      </div>

      <div className="relative">
        {isPaused && (
          <div className="absolute inset-0 z-50 glass-dark rounded-[3rem] flex flex-col items-center justify-center border border-white/10">
            <Pause className="w-12 h-12 text-gold mb-4" />
            <p className="text-gold font-black uppercase tracking-[0.5em] text-xs">Neural Sync Paused</p>
            <button onClick={() => setIsPaused(false)} className="mt-8 px-10 py-4 bg-gold text-black rounded-3xl text-xs font-black uppercase tracking-[0.2em] shadow-3xl">
              Resume Trial
            </button>
          </div>
        )}

        <div className={`glass p-10 rounded-[3rem] shadow-2xl transition-all duration-500 ${isPaused ? 'blur-3xl opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-1 w-6 bg-gold rounded-full"></div>
            <span className="text-[10px] font-black text-gold/40 uppercase tracking-[0.3em]">Module Investigation</span>
          </div>
          <h3 className="text-xl font-bold text-white leading-relaxed tracking-tight">{currentQ.question}</h3>
        </div>
      </div>

      <div className={`space-y-3.5 transition-all duration-500 ${isPaused ? 'blur-lg opacity-5' : 'opacity-100'}`}>
        {currentQ.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={isAnswered || isPaused}
            className={`w-full p-6 rounded-[2rem] text-left text-[13px] font-bold transition-all border flex justify-between items-center transform active:scale-[0.98] shadow-lg ${
              isAnswered
                ? i === currentQ.correctAnswer
                  ? 'bg-green-500/20 border-green-500/40 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.2)]'
                  : i === selectedOption
                  ? 'bg-red-500/20 border-red-500/40 text-red-400'
                  : 'bg-white/5 border-white/5 text-slate-700 opacity-40'
                : 'bg-white/5 border-white/10 hover:border-gold/30 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="tracking-tight leading-relaxed pr-6">{opt}</span>
            <div className="shrink-0">
              {isAnswered && i === currentQ.correctAnswer && <CheckCircle className="w-5 h-5 text-green-400" />}
              {isAnswered && i === selectedOption && i !== currentQ.correctAnswer && <XCircle className="w-5 h-5 text-red-400" />}
              {!isAnswered && <div className="w-6 h-6 rounded-full border-2 border-white/10" />}
            </div>
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-500">
          <div className="glass p-10 rounded-[3rem] border border-white/10 relative shadow-2xl overflow-hidden group">
             {/* Law Section Hint moved inside Answered state for 'Post-Analysis' approach */}
             <div className="absolute -top-3 left-10 bg-gold px-6 py-2 rounded-full text-[9px] font-black text-black uppercase tracking-[0.3em] shadow-xl group-hover:scale-110 transition-transform">
               {currentQ.lawSection}
             </div>
            <p className="text-[13px] text-slate-300 leading-relaxed font-medium mb-8 mt-4">{currentQ.explanation}</p>
            {currentQ.tamilExplanation && (
              <p className="text-[12px] text-gold/90 font-bold italic border-t border-white/10 pt-6 leading-relaxed">
                {currentQ.tamilExplanation}
              </p>
            )}
          </div>
          <button 
            onClick={nextQuestion} 
            className="w-full bg-white text-slate-900 p-7 rounded-[3rem] font-black shadow-3xl flex items-center justify-center space-x-4 uppercase tracking-[0.4em] text-xs hover:bg-gold transition-all animate-pulse hover:animate-none"
          >
            <span>{currentIndex === questions.length - 1 ? 'Evaluate Rank' : 'Proceed To Next Case'}</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
