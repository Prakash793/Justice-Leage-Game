
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Gavel, BookOpen, Play, ChevronRight, WifiOff, ShieldCheck } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Courtroom } from './components/Courtroom';
import { Quiz } from './components/Quiz';
import { BrandLogo } from './components/BrandLogo';
import { User, Theme } from './types';

const STORAGE_KEY = 'jl_user_session_v3';

const getRank = (points: number): string => {
  if (points >= 5000) return 'SUPREME COUNSEL';
  if (points >= 2500) return 'SENIOR ADVOCATE';
  if (points >= 1000) return 'VANGUARD COUNSEL';
  return 'JUNIOR COUNSEL';
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
    rank: 'JUNIOR COUNSEL',
    theme: 'dark'
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser({
        ...parsed,
        rank: getRank(parsed.totalPoints),
        theme: parsed.theme || 'dark'
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

  useEffect(() => {
    if (user.theme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }
  }, [user.theme]);

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

  const handleUpdateUser = (updates: Partial<User>) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
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

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser({
      id: '1',
      email: '',
      name: '',
      totalPoints: 0,
      completedQuizzes: 0,
      casesResolved: 0,
      rank: 'JUNIOR COUNSEL',
      theme: 'dark'
    });
    setAuthState('login');
    setActiveTab('dashboard');
  };

  if (authState === 'login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a192f] overflow-hidden">
        <div className="w-full max-w-sm space-y-10 animate-in fade-in zoom-in duration-1000">
          <div className="text-center relative">
            <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full -z-10"></div>
            <div className="w-44 h-44 mx-auto mb-6 relative group flex items-center justify-center">
              <BrandLogo className="w-full h-full relative z-10 drop-shadow-[0_20px_40px_rgba(251,191,36,0.3)] transform group-hover:scale-105 transition-transform duration-700" />
            </div>
            {/* JUSTICE LEAGUE text in hardcoded CAPS and BOLD with tighter tracking */}
            <h1 className="text-4xl font-black text-white mb-1 uppercase tracking-tighter">JUSTICE LEAGUE</h1>
            <p className="text-gold text-[10px] font-black uppercase tracking-mega opacity-90">Future Counsel • Tamil Nadu</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="glass p-10 rounded-[2.5rem] shadow-3xl space-y-6 border-white/10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gold uppercase tracking-mega ml-3">NAME:</label>
                <input
                  type="text"
                  required
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  placeholder="E.G. ADV. RAMANUJAM"
                  className="w-full px-6 py-4 bg-slate-900/50 border-2 border-white/10 rounded-2xl focus:border-gold focus:outline-none transition-all text-white placeholder:text-slate-600 font-black text-sm uppercase tracking-tight"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gold uppercase tracking-mega ml-3">EMAIL:</label>
                <input
                  type="email"
                  required
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  placeholder="COUNSEL@TN-BAR.COM"
                  className="w-full px-6 py-4 bg-slate-900/50 border-2 border-white/10 rounded-2xl focus:border-gold focus:outline-none transition-all text-white placeholder:text-slate-600 font-black text-sm uppercase tracking-tight"
                />
              </div>
              <button
                type="submit"
                className="w-full h-16 btn-gold rounded-[1.5rem] shadow-3xl active:scale-95 transition-all transform uppercase flex items-center justify-center space-x-3 shine-effect mt-2"
              >
                <span className="text-sm font-black">ENTER THE LEAGUE</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (authState === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a192f]">
        <div className="w-full max-w-sm text-center space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="space-y-8">
             <div className="w-60 h-60 mx-auto relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gold/20 blur-[100px] animate-pulse rounded-full"></div>
                <BrandLogo className="w-full h-full relative z-10" />
             </div>
             <div className="space-y-4">
                <h2 className="text-gold font-black uppercase tracking-mega text-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  CREDENTIALS VERIFIED
                </h2>
                <h1 className="text-4xl font-black text-white leading-tight uppercase tracking-tighter">WELCOME BACK,<br/>COUNSEL {user.name}</h1>
             </div>
          </div>
          
          <button
            onClick={() => setAuthState('app')}
            className="w-full h-18 btn-gold rounded-[1.8rem] shadow-3xl active:scale-95 transition-all transform flex items-center justify-center space-x-4 shine-effect"
          >
            <Play className="w-6 h-6 fill-current" />
            <span className="text-sm font-black">START TRAINING</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen shadow-2xl relative flex flex-col overflow-hidden">
      <div className="sticky top-0 z-50 glass-dark border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-9 h-9">
            <BrandLogo />
          </div>
          <div>
            <h2 className="text-[9px] font-black uppercase tracking-mega text-gold/80">
              {activeTab === 'dashboard' ? 'STATUS' : activeTab === 'court' ? 'ARENA' : 'TRIALS'}
            </h2>
            {isOffline && (
              <div className="flex items-center space-x-1 mt-0.5">
                <WifiOff className="w-2.5 h-2.5 text-red-500" />
                <span className="text-[7px] font-black text-red-500 uppercase tracking-mega">OFFLINE NODE</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right hidden xs:block">
            <p className="text-[8px] font-black text-gold uppercase tracking-mega leading-none mb-1">{user.rank}</p>
            <p className="text-xs font-black leading-none text-white truncate max-w-[120px] uppercase tracking-tighter">{user.name}</p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-gold/20 border-2 border-gold/40 flex items-center justify-center overflow-hidden shadow-lg">
            {user.profileImage ? (
              <img src={user.profileImage} alt="User" className="w-full h-full object-cover" />
            ) : (
              <span className="font-black text-gold text-base">{user.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-40 no-scrollbar">
        {activeTab === 'dashboard' && <Dashboard user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />}
        {activeTab === 'court' && <Courtroom onComplete={(points) => updateStats(points, 0, 1)} />}
        {activeTab === 'quiz' && <Quiz onComplete={(points) => updateStats(points, 1, 0)} />}
      </main>

      <div className="fixed bottom-10 left-0 right-0 max-w-md mx-auto px-6 z-40">
        <nav className="glass p-3.5 rounded-[3rem] flex justify-between items-center shadow-3xl border-2 border-white/10 backdrop-blur-3xl">
          <button onClick={() => setActiveTab('dashboard')} className={`flex-1 flex flex-col items-center space-y-1 py-1.5 ${activeTab === 'dashboard' ? 'text-gold' : 'text-slate-500'}`}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[8px] font-black uppercase tracking-mega">STATUS</span>
          </button>
          
          <button onClick={() => setActiveTab('court')} className={`flex-1 relative flex flex-col items-center space-y-1`}>
            <div className={`p-4 rounded-full -mt-14 shadow-3xl transition-all border-4 ${activeTab === 'court' ? 'btn-gold border-white' : 'bg-slate-800 text-slate-500 border-white/5'}`}>
              <Gavel className="w-7 h-7" />
            </div>
            <span className={`text-[8px] font-black uppercase tracking-mega mt-1 ${activeTab === 'court' ? 'text-gold' : 'text-slate-500'}`}>ARENA</span>
          </button>

          <button onClick={() => setActiveTab('quiz')} className={`flex-1 flex flex-col items-center space-y-1 py-1.5 ${activeTab === 'quiz' ? 'text-gold' : 'text-slate-500'}`}>
            <BookOpen className="w-6 h-6" />
            <span className="text-[8px] font-black uppercase tracking-mega">TRIALS</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default App;
