
import React, { useState, useEffect, useMemo } from 'react';
import { Timer, CheckCircle, XCircle, ChevronRight, Zap, Shield, Pause, Play, Trophy, Rocket, RefreshCcw, GraduationCap, Star, TrendingUp, Calendar, Lock, Check, AlertCircle, Share2, Medal, ArrowLeft } from 'lucide-react';
import { QuizQuestion } from '../types';
import { OFFLINE_QUIZ } from '../data/localContent';

interface QuizProps {
  onComplete: (score: number) => void;
}

const STORAGE_KEY_PROGRESS = 'jl_daily_progress_v3';

// Helper for confetti particles
const Confetti = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      color: ['#fbbf24', '#ffffff', '#3b82f6', '#10b981'][Math.floor(Math.random() * 4)],
      duration: `${3 + Math.random() * 2}s`
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[100]">
      {particles.map(p => (
        <div 
          key={p.id}
          className="confetti"
          style={{ 
            left: p.left, 
            backgroundColor: p.color,
            animation: `confetti-fall ${p.duration} ease-in-out ${p.delay} forwards`
          }}
        />
      ))}
    </div>
  );
};

export const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [answersHistory, setAnswersHistory] = useState<(boolean | null)[]>(new Array(10).fill(null));
  const [completedTopicsToday, setCompletedTopicsToday] = useState<string[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (saved) {
      try {
        const { date, completed } = JSON.parse(saved);
        if (date === today) {
          setCompletedTopicsToday(completed);
        } else {
          localStorage.removeItem(STORAGE_KEY_PROGRESS);
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY_PROGRESS);
      }
    }
  }, []);

  // Score counter animation
  useEffect(() => {
    if (showResults && animatedScore < score) {
      const timer = setTimeout(() => {
        setAnimatedScore(prev => Math.min(prev + 2, score));
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [showResults, animatedScore, score]);

  const saveCompletion = (finishedTopic: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newCompleted = [...new Set([...completedTopicsToday, finishedTopic])];
    setCompletedTopicsToday(newCompleted);
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify({
      date: today,
      completed: newCompleted
    }));
  };

  const getDailySet = (arr: QuizQuestion[]) => {
    const count = 10;
    if (arr.length === 0) return [];
    const startDate = new Date('2024-01-01').getTime();
    const today = new Date().getTime();
    const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const maxSets = Math.floor(arr.length / count);
    const setIndex = daysSinceStart % (maxSets || 1);
    const startPos = setIndex * count;
    return arr.slice(startPos, startPos + count);
  };

  const startQuiz = (selectedTopic: string) => {
    if (completedTopicsToday.includes(selectedTopic)) return;
    setLoading(true);
    setTopic(selectedTopic);
    setTimeout(() => {
      let q: QuizQuestion[] = [];
      if (OFFLINE_QUIZ[selectedTopic]) {
        q = getDailySet(OFFLINE_QUIZ[selectedTopic]);
      }
      setQuestions(q);
      setCurrentIndex(0);
      setScore(0);
      setAnimatedScore(0);
      setTimeLeft(60);
      setShowResults(false);
      setIsAnswered(false);
      setIsPaused(false);
      setSelectedOption(null);
      setAnswersHistory(new Array(10).fill(null));
      setLoading(false);
    }, 800);
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
    const isCorrect = index === questions[currentIndex].correctAnswer;
    setSelectedOption(index);
    setIsAnswered(true);
    
    const newHistory = [...answersHistory];
    newHistory[currentIndex] = isCorrect;
    setAnswersHistory(newHistory);

    if (isCorrect) {
      setScore(prev => prev + 10);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(60);
      setIsPaused(false);
    } else {
      setShowResults(true);
      if (topic) saveCompletion(topic);
      onComplete(score);
    }
  };

  if (!topic) {
    return (
      <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="text-center mt-4">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gold/10 border border-gold/20 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl relative group">
            <GraduationCap className="w-10 h-10 md:w-12 md:h-12 text-gold group-hover:scale-110 transition-transform" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-full animate-pulse shadow-lg uppercase tracking-tighter">90-Day Loop</div>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Bar Entrance Trials</h1>
          <p className="text-[9px] font-black text-gold uppercase tracking-[0.3em] opacity-60 mt-3 flex items-center justify-center">
            <Calendar className="w-3 h-3 mr-2" />
            NEW UNIQUE CHALLENGE EVERY 24HRS
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {Object.keys(OFFLINE_QUIZ).map((t) => {
            const isCompleted = completedTopicsToday.includes(t);
            return (
              <button
                key={t}
                onClick={() => startQuiz(t)}
                disabled={isCompleted}
                className={`p-5 md:p-6 glass border rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-between transition-all active:scale-95 group relative overflow-hidden ${
                  isCompleted 
                  ? 'border-green-500/20 bg-green-500/5 opacity-80' 
                  : 'border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-4 md:space-x-5 relative z-10">
                  <div className={`p-3 md:p-4 rounded-2xl border transition-colors ${
                    isCompleted 
                    ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                    : 'bg-white/5 border-white/10 text-gold group-hover:bg-gold group-hover:text-black'
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5 md:w-6 md:h-6" /> : <Shield className="w-5 h-5 md:w-6 md:h-6" />}
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-base md:text-lg block tracking-tight">{t}</span>
                    <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center ${isCompleted ? 'text-green-400' : 'text-slate-500'}`}>
                      {isCompleted ? 'COMPLETED' : '10 UNIQUE CASES'}
                    </span>
                  </div>
                </div>
                {!isCompleted && <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all z-10 text-gold" />}
              </button>
            );
          })}
        </div>

        <div className="p-6 md:p-8 rounded-[2.5rem] bg-white/5 border border-white/10 text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="w-4 h-4 text-gold/60" />
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Daily Trial Persistence: Active
              </p>
            </div>
            <div className="flex justify-center space-x-2">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < completedTopicsToday.length ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-slate-800'}`} />
               ))}
            </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-8 p-6 text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gold/10 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-gold border-t-transparent rounded-full animate-spin absolute top-0"></div>
          <Rocket className="w-8 h-8 text-gold absolute top-6 left-6 animate-pulse" />
        </div>
        <div>
          <p className="text-gold font-black uppercase tracking-[0.3em] text-xs">Empaneling Unique Batch</p>
          <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest leading-relaxed">Verifying non-repeating cases for your profile...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const totalPossible = questions.length * 10;
    const percentage = (score / totalPossible) * 100;
    const rank = percentage >= 80 ? 'SUPREME COUNSEL' : percentage >= 50 ? 'SENIOR ADVOCATE' : 'JUNIOR COUNSEL';
    const isSuccess = percentage >= 50;
    
    return (
      <div className="relative min-h-[90vh] flex flex-col items-center pt-12 pb-24 px-6 overflow-hidden animate-in fade-in duration-1000">
        {percentage >= 70 && <Confetti />}
        
        {/* Victory/Defeat Background Glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] blur-[120px] opacity-20 pointer-events-none -z-10 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

        <div className="text-center space-y-2 mb-10 relative z-10">
          <p className="text-gold font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center">
            <Medal className="w-4 h-4 mr-2" />
            Daily Trial Concluded
          </p>
          <h2 className="text-4xl font-serif font-bold tracking-tight">The Verdict</h2>
        </div>

        <div className="relative group mb-12 animate-in zoom-in duration-500 delay-200">
          <div className={`absolute -inset-8 blur-[60px] opacity-30 group-hover:opacity-50 transition-opacity ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <div className="h-64 w-64 rounded-[4rem] glass-dark border-4 border-gold/20 flex flex-col items-center justify-center shadow-3xl relative">
            <Trophy className={`absolute -top-8 -right-8 w-20 h-20 drop-shadow-2xl transition-transform hover:scale-110 ${isSuccess ? 'text-gold' : 'text-slate-500'}`} />
            
            <div className="text-center">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em] mb-1">Final Score</p>
              <div className="flex items-baseline justify-center">
                <span className="text-8xl font-black tracking-tighter text-white">{animatedScore}</span>
                <span className="text-lg font-black text-gold/50 ml-1">/100</span>
              </div>
            </div>

            <div className="absolute -bottom-5 bg-gold text-black px-8 py-2.5 rounded-full font-black text-[9px] uppercase tracking-[0.3em] shadow-2xl border-4 border-white/20 whitespace-nowrap shine-effect">
              {rank}
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-4 animate-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="grid grid-cols-2 gap-4">
             <div className="glass p-5 rounded-[2rem] border border-white/5 text-center">
                <div className="flex items-center justify-center space-x-1 mb-1 opacity-50">
                  <Star className="w-3 h-3 text-gold fill-current" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Precision</span>
                </div>
                <p className="text-2xl font-black text-white">{percentage}%</p>
             </div>
             <div className="glass p-5 rounded-[2rem] border border-white/5 text-center">
                <div className="flex items-center justify-center space-x-1 mb-1 opacity-50">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Growth</span>
                </div>
                <p className="text-2xl font-black text-green-400">+{score/2} XP</p>
             </div>
          </div>

          <div className="glass p-6 rounded-[2.5rem] border border-white/10 space-y-4">
             <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center">
               <Shield className="w-3 h-3 mr-2" />
               Case History
             </h3>
             <div className="flex justify-between items-center px-1">
                {answersHistory.map((res, i) => (
                  <div key={i} className={`flex-1 h-2 mx-0.5 first:ml-0 last:mr-0 rounded-full ${res === true ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : res === false ? 'bg-red-500' : 'bg-slate-800'}`} />
                ))}
             </div>
             <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic text-center">
                {isSuccess 
                  ? "Outstanding advocacy. Your command of the BNS/BNSS framework is noted by the Bench."
                  : "Further deliberation required. Re-examine the statutes and return tomorrow for fresh cases."}
             </p>
          </div>
        </div>

        <div className="fixed bottom-8 left-6 right-6 max-w-sm mx-auto flex space-x-3">
          <button 
            onClick={() => setTopic(null)} 
            className="flex-1 bg-gold text-slate-900 h-16 rounded-2xl font-black shadow-3xl uppercase tracking-[0.2em] text-[10px] flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            <span>Finish Session</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-gold active:scale-90 transition-all border border-gold/20">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  if (!currentQ) return <div className="p-10 text-center text-gold uppercase font-black text-xs tracking-widest animate-pulse">Summoning Case Details...</div>;

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 animate-in fade-in duration-500 max-w-md mx-auto">
      {/* Header HUD */}
      <div className="flex justify-between items-center bg-white/5 p-3 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 shadow-lg">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gold/10 border border-gold/20 flex flex-col items-center justify-center font-black text-gold">
            <span className="text-[7px] md:text-[8px] opacity-60 uppercase">CASE</span>
            <span className="text-lg md:text-xl leading-none">{currentIndex + 1}</span>
          </div>
          <div className="flex items-center space-x-1">
            {answersHistory.map((res, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentIndex ? 'w-5 md:w-6 bg-gold shadow-[0_0_10px_gold]' :
                  res === true ? 'w-2 bg-green-500' :
                  res === false ? 'w-2 bg-red-500' :
                  'w-1 bg-white/10'
                }`} 
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
           <button onClick={() => setIsPaused(!isPaused)} className={`p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all ${isPaused ? 'bg-gold border-gold text-black scale-110 shadow-xl' : 'bg-white/5 border-white/10 text-slate-500'}`}>
             {isPaused ? <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" /> : <Pause className="w-4 h-4 md:w-5 md:h-5" />}
           </button>
           <div className={`flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl border ${timeLeft < 15 && !isPaused ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse' : 'bg-white/5 border-white/10 text-gold'}`}>
             <span className="font-black text-[10px] md:text-xs tabular-nums tracking-tighter">{timeLeft}s</span>
           </div>
        </div>
      </div>

      <div className="relative">
        {isPaused && (
          <div className="absolute inset-0 z-50 glass-dark rounded-[2rem] md:rounded-[3rem] flex flex-col items-center justify-center border border-white/10 scale-105">
            <Pause className="w-10 h-10 text-gold mb-4" />
            <p className="text-gold font-black uppercase tracking-[0.4em] text-[10px]">Trial Suspended</p>
            <button onClick={() => setIsPaused(false)} className="mt-8 px-8 py-3 bg-gold text-black rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-3xl">
              Resume Cross-Exam
            </button>
          </div>
        )}

        <div className={`glass p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl transition-all duration-500 ${isPaused ? 'blur-3xl opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="flex items-center space-x-2 mb-6 opacity-40">
            <div className="h-1 w-4 bg-gold rounded-full"></div>
            <span className="text-[8px] md:text-[9px] font-black text-gold uppercase tracking-[0.3em]">Evidence Log</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold leading-tight tracking-tight">{currentQ.question}</h3>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-3 transition-all duration-500 ${isPaused ? 'blur-lg opacity-5' : 'opacity-100'}`}>
        {currentQ.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={isAnswered || isPaused}
            className={`w-full p-5 rounded-2xl md:rounded-[2rem] text-left text-xs md:text-[13px] font-bold transition-all border flex justify-between items-center transform active:scale-[0.98] shadow-md ${
              isAnswered
                ? i === currentQ.correctAnswer
                  ? 'bg-green-500/20 border-green-500/40 text-green-400 shadow-xl'
                  : i === selectedOption
                  ? 'bg-red-500/20 border-red-500/40 text-red-400'
                  : 'bg-white/5 border-white/5 text-slate-700 opacity-30'
                : 'bg-white/5 border-white/10 hover:border-gold/30 text-slate-400 hover:text-white'
            }`}
          >
            <span className="tracking-tight leading-snug pr-4">{opt}</span>
            <div className="shrink-0">
              {isAnswered && i === currentQ.correctAnswer && <CheckCircle className="w-5 h-5 text-green-400" />}
              {isAnswered && i === selectedOption && i !== currentQ.correctAnswer && <XCircle className="w-5 h-5 text-red-400" />}
              {!isAnswered && <div className="w-5 h-5 rounded-full border-2 border-white/10" />}
            </div>
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="glass p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/10 relative shadow-2xl">
             <div className="absolute -top-3 left-8 md:left-10 bg-gold px-5 md:px-6 py-2 rounded-full text-[8px] md:text-[9px] font-black text-black uppercase tracking-[0.2em] shadow-xl">
               {currentQ.lawSection}
             </div>
            <p className="text-[12px] md:text-[13px] opacity-80 leading-relaxed font-medium mb-6 mt-4">{currentQ.explanation}</p>
            {currentQ.tamilExplanation && (
              <div className="border-t border-white/10 pt-6">
                <p className="text-[11px] md:text-[12px] text-gold/90 font-bold italic leading-relaxed">
                  {currentQ.tamilExplanation}
                </p>
              </div>
            )}
          </div>
          <button 
            onClick={nextQuestion} 
            className="w-full bg-white text-slate-900 h-16 md:h-20 rounded-[2rem] md:rounded-[3rem] font-black shadow-3xl flex items-center justify-center space-x-3 uppercase tracking-[0.3em] text-[10px] md:text-xs hover:bg-gold transition-all animate-in zoom-in"
          >
            <span>{currentIndex === questions.length - 1 ? 'Evaluate Standing' : 'Continue Trial'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
