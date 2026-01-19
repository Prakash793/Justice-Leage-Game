
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Gavel, BookOpen, Zap, Play, ChevronRight, WifiOff, ShieldCheck } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Courtroom } from './components/Courtroom';
import { Quiz } from './components/Quiz';
import { User } from './types';

const LOGO_URL = "./logo.png";
const STORAGE_KEY = 'jl_user_session';

const getRank = (points: number): string => {
  if (points >= 5000) return 'Supreme Counsel';
  if (points >= 2500) return 'Senior Advocate';
  if (points >= 1000) return 'Vanguard Counsel';
  return 'Junior Counsel';
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'court' | 'quiz'>('dashboard');
  const [authState, setAuthState] = useState<'login' | 'welcome' | 'app'>('login');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  const [user, setUser] = useState<User>({
    id: '1',
    email: '',
    name: '',
    totalPoints: 0,
    completedQuizzes: 0,
    casesResolved: 0,
    rank: 'Junior Counsel'
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser({
        ...parsed,
        rank: getRank(parsed.totalPoints) // Recalculate rank on load
      });
      setAuthState('app');
    }

    const handleStatusChange = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  // Persist user state changes to localStorage
  const updateStats = (points: number, quizzes: number, cases: number) => {
    setUser(prev => {
      const newPoints = prev.totalPoints + points;
      const updated = {
        ...prev,
        totalPoints: newPoints,
        completedQuizzes: prev.completedQuizzes + quizzes,
        casesResolved: prev.casesResolved + cases,
        rank: getRank(newPoints)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.email.includes('@') && user.name.trim().length > 0) {
      const newUser = { ...user, rank: getRank(user.totalPoints) };
      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setAuthState('welcome');
    }
  };

  if (authState === 'login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a192f]">
        <div className="w-full max-w-sm space-y-10 animate-in fade-in zoom-in duration-700">
          <div className="text-center">
            <div className="w-52 h-52 mx-auto mb-6 relative group">
              <div className="absolute inset-0 bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all rounded-full"></div>
              <img 
                src={LOGO_URL} 
                alt="Justice League Student Edition" 
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-1 tracking-tight">JUSTICE LEAGUE</h1>
            <p className="text-gold text-[10px] font-black uppercase tracking-[0.4em] opacity-90">STUDENT EDITION • TAMIL NADU</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="glass p-8 rounded-[2.5rem] shadow-2xl space-y-5 border-white/10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-1">Name:</label>
                <input
                  type="text"
                  required
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  placeholder="e.g. Adv. Raman"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-gold focus:outline-none transition-all text-white placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-1">Email:</label>
                <input
                  type="email"
                  required
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  placeholder="counsel@tnlaw.edu"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-gold focus:outline-none transition-all text-white placeholder:text-slate-600"
                />
              </div>
              <button
                type="submit"
                className="w-full py-5 bg-gold text-slate-900 font-black rounded-2xl shadow-xl active:scale-95 transition-all transform uppercase tracking-widest text-sm flex items-center justify-center space-x-2"
              >
                <span>Start the Game</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-[9px] text-slate-500 uppercase tracking-widest font-black">
              End-to-End Local Encryption
            </p>
          </form>
        </div>
      </div>
    );
  }

  if (authState === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a192f]">
        <div className="w-full max-w-sm text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="space-y-6">
             <div className="w-64 h-64 mx-auto relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-[60px] animate-pulse"></div>
                <img 
                  src={LOGO_URL} 
                  alt="Justice League Logo" 
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
                />
             </div>
             <div className="space-y-2">
                <h2 className="text-gold font-black uppercase tracking-[0.4em] text-xs flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  AUTHENTICATION SUCCESS
                  <ShieldCheck className="w-4 h-4 ml-2" />
                </h2>
                <h1 className="text-4xl font-serif font-bold text-white leading-tight">Welcome, Counsel {user.name}!</h1>
             </div>
          </div>
          
          <div className="glass p-8 rounded-[3rem] border border-white/10 relative overflow-hidden">
            <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
              Your legal training environment is ready. 100% Offline Capability detected.
            </p>
            <button
              onClick={() => setAuthState('app')}
              className="w-full py-6 bg-gold text-slate-900 font-black rounded-3xl shadow-3xl active:scale-95 transition-all transform uppercase tracking-[0.3em] text-sm flex items-center justify-center space-x-3 group"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>ENTER THE LEAGUE</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#0a192f] shadow-2xl relative text-slate-100 flex flex-col overflow-hidden">
      {/* HUD Header */}
      <div className="sticky top-0 z-50 glass-dark border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src={LOGO_URL} alt="Justice Logo" className="w-8 h-8 object-contain" />
          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
            {activeTab === 'dashboard' ? 'STATUS' : activeTab === 'court' ? 'ARENA' : 'TRIALS'}
          </h2>
          {isOffline && (
            <div className="flex items-center space-x-1 px-2 py-0.5 bg-red-500/20 border border-red-500/40 rounded-full">
              <WifiOff className="w-2.5 h-2.5 text-red-400" />
              <span className="text-[8px] font-black text-red-400 uppercase tracking-tighter">Offline</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right hidden xs:block">
            <p className="text-[7px] font-black text-gold uppercase tracking-tighter leading-none mb-1">{user.rank}</p>
            <p className="text-[10px] font-bold text-white leading-none truncate max-w-[80px]">{user.name}</p>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center overflow-hidden">
            <span className="font-black text-gold text-sm">{user.name.charAt(0)}</span>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        {activeTab === 'dashboard' && <Dashboard user={user} />}
        {activeTab === 'court' && <Courtroom onComplete={(points) => updateStats(points, 0, 1)} />}
        {activeTab === 'quiz' && <Quiz onComplete={(points) => updateStats(points, 1, 0)} />}
      </main>

      {/* Nav */}
      <div className="fixed bottom-6 left-0 right-0 max-w-md mx-auto px-4 z-40">
        <nav className="glass p-3 rounded-full flex justify-between items-center shadow-3xl border border-white/10 backdrop-blur-2xl">
          <button onClick={() => setActiveTab('dashboard')} className={`flex-1 flex flex-col items-center space-y-1 transition-all py-2 rounded-full ${activeTab === 'dashboard' ? 'text-gold scale-105' : 'text-slate-500'}`}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-wider">Status</span>
          </button>
          
          <button onClick={() => setActiveTab('court')} className={`flex-1 relative flex flex-col items-center space-y-1 transition-all group`}>
            <div className={`p-4 rounded-full -mt-12 shadow-3xl transition-all border-2 ${activeTab === 'court' ? 'bg-gold text-black scale-110 border-white' : 'bg-slate-800 text-slate-500'}`}>
              <Gavel className="w-8 h-8" />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-wider mt-1 ${activeTab === 'court' ? 'text-gold' : 'text-slate-500'}`}>Arena</span>
          </button>

          <button onClick={() => setActiveTab('quiz')} className={`flex-1 flex flex-col items-center space-y-1 transition-all py-2 rounded-full ${activeTab === 'quiz' ? 'text-gold scale-105' : 'text-slate-500'}`}>
            <BookOpen className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-wider">Trials</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default App;
