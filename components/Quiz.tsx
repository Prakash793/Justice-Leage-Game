
import React, { useState, useEffect, useMemo } from 'react';
import { Timer, CheckCircle, XCircle, ChevronRight, Zap, Shield, Pause, Play, Trophy, Rocket, RefreshCcw, GraduationCap, Star, TrendingUp, Calendar, Lock, Check, AlertCircle, Share2, Medal, ArrowLeft, Heart, Flame } from 'lucide-react';
import { QuizQuestion } from '../types';
import { OFFLINE_QUIZ } from '../data/localContent';

interface QuizProps {
  onComplete: (score: number) => void;
}

const STORAGE_KEY_PROGRESS = 'jl_daily_progress_v3';

const Confetti = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      color: ['#fbbf24', '#ffffff', '#f59e0b', '#fb7185'][Math.floor(Math.random() * 4)],
      duration: `${2.5 + Math.random() * 1.5}s`
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
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
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

  useEffect(() => {
    if (showResults && animatedScore < score) {
      const timer = setTimeout(() => {
        setAnimatedScore(prev => Math.min(prev + 1, score));
      }, 20);
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
    if (isCorrect) setScore(prev => prev + 10);
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
      <div className="p-6 space-y-12 animate-in fade-in duration-500 max-w-md mx-auto h-full flex flex-col">
        <div className="text-center mt-12">
          <div className="w-20 h-20 bg-gold/20 border-2 border-gold/40 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-3xl relative animate-in zoom-in duration-500">
            <GraduationCap className="w-10 h-10 text-gold" />
            <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full shadow-2xl uppercase tracking-ultra">LIVE</div>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-3 uppercase">Legal Trials</h1>
          <p className="text-[11px] font-black text-gold uppercase tracking-ultra opacity-80">Daily Challenge Hub</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 flex-1">
          {Object.keys(OFFLINE_QUIZ).map((t) => {
            const isCompleted = completedTopicsToday.includes(t);
            return (
              <button
                key={t}
                onClick={() => startQuiz(t)}
                disabled={isCompleted}
                className={`p-7 glass border-2 rounded-[2.8rem] flex items-center justify-between transition-all active:scale-95 group relative overflow-hidden ${
                  isCompleted 
                  ? 'border-green-500/20 bg-green-500/5 opacity-80 shadow-inner' 
                  : 'border-white/10 hover:border-gold/40 hover:bg-white/5 shadow-2xl'
                }`}
              >
                <div className="flex items-center space-x-6 relative z-10">
                  <div className={`p-5 rounded-[1.8rem] border-2 transition-all ${
                    isCompleted 
                    ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                    : 'bg-white/5 border-white/10 text-gold group-hover:bg-gold group-hover:text-black'
                  }`}>
                    {isCompleted ? <Check className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                  </div>
                  <div className="text-left space-y-1">
                    <span className="font-black text-lg block tracking-tight text-white uppercase">{t}</span>
                    <span className={`text-[10px] font-black uppercase tracking-mega flex items-center ${isCompleted ? 'text-green-400' : 'text-slate-500'}`}>
                      {isCompleted ? 'VERDICT RENDERED' : '10 CASE FILES'}
                    </span>
                  </div>
                </div>
                {!isCompleted && <ChevronRight className="w-6 h-6 text-gold opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-12 p-6 text-center">
        <div className="relative">
          <div className="w-20 h-20 border-[8px] border-white/10 rounded-full"></div>
          <div className="w-20 h-20 border-[8px] border-gold border-t-transparent rounded-full animate-spin absolute top-0"></div>
          <Flame className="w-9 h-9 text-gold absolute top-5.5 left-5.5 animate-pulse" />
        </div>
        <div className="space-y-4">
          <p className="text-white font-black uppercase tracking-ultra text-xs">Empaneling Court</p>
          <p className="text-[10px] text-gold font-black uppercase tracking-mega opacity-60">Curating non-repeating cycle questions...</p>
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
      <div className="relative min-h-screen flex flex-col items-center pt-24 pb-40 px-6 overflow-hidden animate-in fade-in duration-1000 max-w-md mx-auto">
        {percentage >= 70 && <Confetti />}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] blur-[160px] opacity-25 -z-10 ${isSuccess ? 'bg-amber-400' : 'bg-red-500'}`}></div>

        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-3 bg-gold/20 px-5 py-2 rounded-full border border-gold/40 mb-4 shadow-xl">
            <Medal className="w-4 h-4 text-gold" />
            <span className="text-gold font-black uppercase tracking-mega text-[10px]">TRIAL FINALIZED</span>
          </div>
          <h2 className="text-5xl font-black tracking-tight text-white leading-tight uppercase">The Final Verdict</h2>
        </div>

        <div className="relative group mb-16 animate-in zoom-in duration-700">
          <div className={`absolute -inset-14 blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity rounded-full ${isSuccess ? 'bg-amber-400' : 'bg-red-500'}`}></div>
          <div className={`h-72 w-72 rounded-[5.5rem] glass-dark border-4 flex flex-col items-center justify-center shadow-3xl relative ${isSuccess ? 'border-gold/40' : 'border-red-500/30'}`}>
            <Trophy className={`absolute -top-10 -right-10 w-28 h-28 drop-shadow-2xl transition-transform hover:scale-110 ${isSuccess ? 'text-gold' : 'text-slate-600'}`} />
            
            <div className={`text-center ${isSuccess ? 'perfect-pulse' : ''}`}>
              <p className="text-[11px] text-slate-500 font-black uppercase tracking-ultra mb-2">TRIAL ACCURACY</p>
              <div className="flex items-baseline justify-center">
                <span className="text-9xl font-black tracking-tighter text-white">{animatedScore}</span>
                <span className="text-2xl font-black text-gold/80 ml-1">%</span>
              </div>
            </div>

            <div className="absolute -bottom-6 bg-gold text-slate-900 px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-ultra shadow-3xl border-4 border-white/20 whitespace-nowrap shine-effect">
              {rank}
            </div>
          </div>
        </div>

        <div className="w-full space-y-6 animate-in slide-in-from-bottom-12 duration-1000">
          <div className="grid grid-cols-2 gap-6">
             <div className="glass p-7 rounded-[3rem] border-white/10 text-center shadow-xl">
                <p className="text-4xl font-black text-white leading-none">{score/10}<span className="text-base text-slate-500 ml-1">/ 10</span></p>
                <span className="text-[10px] font-black uppercase tracking-mega text-gold/70 mt-3 block">CORRECT</span>
             </div>
             <div className="glass p-7 rounded-[3rem] border-white/10 text-center shadow-xl">
                <p className="text-4xl font-black text-green-400 leading-none">+{score * 5}</p>
                <span className="text-[10px] font-black uppercase tracking-mega text-gold/70 mt-3 block">XP GAINED</span>
             </div>
          </div>

          <div className="glass p-9 rounded-[3.5rem] border-white/10 space-y-8 shadow-2xl">
             <div className="flex justify-between items-center mb-1">
                <h3 className="text-[11px] font-black uppercase tracking-ultra text-white">TRIAL MAP</h3>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-mega">{isSuccess ? 'EXCELLENT' : 'RETRY'}</span>
             </div>
             <div className="flex justify-between items-center px-2">
                {answersHistory.map((res, i) => (
                  <div key={i} className={`flex-1 h-4 mx-1.5 first:ml-0 last:mr-0 rounded-full transition-all duration-1000 ${res === true ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : res === false ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-white/5'}`} />
                ))}
             </div>
          </div>
        </div>

        <div className="fixed bottom-12 left-8 right-8 max-w-sm mx-auto">
          <button 
            onClick={() => setTopic(null)} 
            className="w-full btn-gold h-18 rounded-[2rem] text-[11px] font-black shadow-3xl flex items-center justify-center space-x-4 active:scale-95 transition-all shine-effect"
          >
            <span className="tracking-ultra">DISMISS COURT</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return <div className="p-12 text-center text-gold font-black uppercase tracking-ultra animate-pulse">Summoning Case...</div>;

  return (
    <div className="p-5 space-y-8 animate-in fade-in duration-500 max-w-md mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center glass p-5 rounded-[2.2rem] shadow-2xl border-white/10 shrink-0">
        <div className="flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border-2 border-gold/40 flex flex-col items-center justify-center font-black text-gold shadow-lg">
            <span className="text-[8px] opacity-70 uppercase tracking-widest">CASE</span>
            <span className="text-2xl leading-none">{currentIndex + 1}</span>
          </div>
          <div className="flex items-center space-x-2">
            {answersHistory.map((res, i) => (
              <div 
                key={i} 
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  i === currentIndex ? 'w-8 bg-gold shadow-[0_0_20px_gold]' :
                  res === true ? 'w-3 bg-green-500' :
                  res === false ? 'w-3 bg-red-500' :
                  'w-2 bg-white/10'
                }`} 
              />
            ))}
          </div>
        </div>
        <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all shadow-lg ${timeLeft < 15 && !isPaused ? 'bg-red-500/20 border-red-500/60 text-red-500 animate-pulse' : 'bg-white/5 border-white/20 text-gold'}`}>
          <span className="font-black text-xs tracking-tight tabular-nums uppercase">{timeLeft}S</span>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col space-y-8 overflow-y-auto no-scrollbar pb-32">
        <div className="glass p-10 rounded-[3.2rem] shadow-3xl relative border-white/10">
          <div className="flex items-center space-x-3 mb-8 opacity-60">
            <Flame className="w-5 h-5 text-gold" />
            <span className="text-[11px] font-black text-gold uppercase tracking-ultra">Evidence Log</span>
          </div>
          <h3 className="text-2xl font-black leading-tight tracking-tight text-white uppercase">{currentQ.question}</h3>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={isAnswered || isPaused}
              className={`w-full p-7 rounded-[2.2rem] text-left text-[15px] font-bold transition-all border-2 flex justify-between items-center shadow-xl transform active:scale-[0.98] ${
                isAnswered
                  ? i === currentQ.correctAnswer
                    ? 'bg-green-500/20 border-green-500/60 text-white shadow-2xl'
                    : i === selectedOption
                    ? 'bg-red-500/30 border-red-500/60 text-white shadow-xl'
                    : 'bg-white/5 border-white/5 text-slate-700 opacity-20'
                  : 'bg-white/10 border-white/10 hover:border-gold/60 text-white hover:bg-white/20'
              }`}
            >
              <span className="pr-5 leading-tight uppercase font-black">{opt}</span>
              <div className="shrink-0 ml-2">
                {isAnswered && i === currentQ.correctAnswer && <CheckCircle className="w-6 h-6 text-green-400" />}
                {isAnswered && i === selectedOption && i !== currentQ.correctAnswer && <XCircle className="w-6 h-6 text-red-400" />}
                {!isAnswered && <div className="w-6 h-6 rounded-full border-2 border-white/20" />}
              </div>
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-500 pb-12">
            <div className="glass p-10 rounded-[3.5rem] border-2 border-white/10 relative shadow-3xl">
               <div className="absolute -top-5 left-10 btn-gold px-8 py-2.5 rounded-full text-[10px] font-black shadow-3xl tracking-ultra">
                 {currentQ.lawSection.toUpperCase()}
               </div>
              <p className="text-[15px] text-white/95 leading-relaxed font-bold mb-8 mt-6 uppercase tracking-tight">{currentQ.explanation}</p>
              {currentQ.tamilExplanation && (
                <div className="border-t border-white/10 pt-8">
                  <p className="text-[14px] text-gold font-black italic leading-relaxed">
                    {currentQ.tamilExplanation}
                  </p>
                </div>
              )}
            </div>
            
            <button 
              onClick={nextQuestion} 
              className="w-full btn-gold h-18 rounded-[2.2rem] shadow-3xl flex items-center justify-center space-x-4 active:scale-95 transform transition-all"
            >
              <span className="tracking-ultra text-[11px] font-black">
                {currentIndex === questions.length - 1 ? 'VIEW STANDING' : 'CONTINUE TRIAL'}
              </span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
