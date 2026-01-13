
import React, { useState } from 'react';
import { LayoutDashboard, Gavel, BookOpen, User as UserIcon, Scale, Shield, Zap, Play, ChevronRight } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Courtroom } from './components/Courtroom';
import { Quiz } from './components/Quiz';
import { User } from './types';

const LOGO_URL = "https://files.oaiusercontent.com/file-KAtI6k5IqXjWjC7jH953U1?se=2025-02-21T11%3A37%3A05Z&sp=r&sv=24.12.30&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D46387930-01c3-42e5-ae75-0be1f5c69780.webp&sig=8y%2BZpG/pGOn0YV5S0W9A0D0Zl20uR3V7G4jX6wO5V5Y%3D";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'court' | 'quiz'>('dashboard');
  const [authState, setAuthState] = useState<'login' | 'welcome' | 'app'>('login');
  const [user, setUser] = useState<User>({
    id: '1',
    email: '',
    name: '',
    totalPoints: 1250,
    completedQuizzes: 48,
    casesResolved: 12,
    rank: 'Vanguard Counsel'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.email.includes('@') && user.name.trim().length > 0) {
      setAuthState('welcome');
    }
  };

  if (authState === 'login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0f172a]">
        <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="text-center logo-container">
            <div className="w-48 h-48 mx-auto mb-4 relative group">
              <div className="absolute inset-0 bg-gold/20 blur-3xl group-hover:bg-gold/40 transition-all rounded-full"></div>
              <img 
                src={LOGO_URL} 
                alt="Justice League Logo" 
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
              />
            </div>
            <h1 className="text-4xl font-serif font-bold text-white mb-1 tracking-tight">JUSTICE LEAGUE</h1>
            <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em]">Student Edition • Login</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="glass p-8 rounded-[2.5rem] shadow-2xl space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-1">Hero Name</label>
                <input
                  type="text"
                  required
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  placeholder="e.g. Counsel Arun"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-gold focus:outline-none transition-all text-white placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-1">Member Email ID</label>
                <input
                  type="email"
                  required
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  placeholder="counsel@justiceleague.edu"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-gold focus:outline-none transition-all text-white placeholder:text-slate-600"
                />
              </div>
              <button
                type="submit"
                className="w-full py-5 bg-gold text-slate-900 font-black rounded-2xl shadow-xl shadow-gold/20 active:scale-95 transition-all transform uppercase tracking-widest text-sm flex items-center justify-center space-x-2"
              >
                <span>Initialize Sequence</span>
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
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0f172a]">
        <div className="w-full max-w-sm text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="space-y-4">
             <div className="w-56 h-56 mx-auto relative">
                <div className="absolute inset-0 bg-gold/30 blur-[60px] animate-pulse"></div>
                <img src={LOGO_URL} alt="Justice League Logo" className="w-full h-full object-contain relative z-10" />
             </div>
             <div className="space-y-2">
                <h2 className="text-gold font-black uppercase tracking-[0.4em] text-xs">Access Granted</h2>
                <h1 className="text-4xl font-serif font-bold text-white">Welcome, {user.name.split(' ')[0]}!</h1>
             </div>
          </div>
          
          <div className="glass p-6 rounded-[2rem] border border-white/10">
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              Your neural link to the Tamil Nadu Legal Archive is now active. 
              The Arena awaits your arguments.
            </p>
            <button
              onClick={() => setAuthState('app')}
              className="w-full py-6 bg-white text-slate-900 font-black rounded-2xl shadow-2xl active:scale-95 transition-all transform uppercase tracking-[0.3em] text-sm flex items-center justify-center space-x-3 group"
            >
              <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
              <span>START PLAY</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#0f172a] shadow-2xl relative text-slate-100 flex flex-col">
      {/* Top Header */}
      <div className="sticky top-0 z-50 glass-dark border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8">
            <img src={LOGO_URL} className="w-full h-full object-contain" alt="Small Logo" />
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">
            {activeTab === 'dashboard' ? 'STATUS' : activeTab === 'court' ? 'ARENA' : 'TRIALS'}
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-[8px] font-black text-gold uppercase tracking-tighter">{user.rank}</p>
            <p className="text-[10px] font-bold text-white leading-none">{user.name}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center overflow-hidden">
            <span className="font-black text-gold text-sm">{user.name.charAt(0)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        {activeTab === 'dashboard' && <Dashboard user={user} />}
        {activeTab === 'court' && <Courtroom />}
        {activeTab === 'quiz' && <Quiz />}
      </main>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-6 left-0 right-0 max-w-md mx-auto px-4 z-40">
        <nav className="glass p-3 rounded-full flex justify-between items-center shadow-2xl border border-white/10">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 flex flex-col items-center space-y-1 transition-all py-2 rounded-full ${activeTab === 'dashboard' ? 'text-gold scale-105' : 'text-slate-500 hover:text-white'}`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-wider">Status</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('court')}
            className={`flex-1 relative flex flex-col items-center space-y-1 transition-all group`}
          >
            <div className={`p-4 rounded-full -mt-12 shadow-2xl transition-all border-2 border-white/20 ${activeTab === 'court' ? 'bg-gold text-black scale-110 border-gold shadow-gold/20' : 'bg-slate-800 text-slate-500 group-hover:text-white'}`}>
              <Gavel className="w-8 h-8" />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-wider mt-1 ${activeTab === 'court' ? 'text-gold' : 'text-slate-500'}`}>Arena</span>
          </button>

          <button 
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 flex flex-col items-center space-y-1 transition-all py-2 rounded-full ${activeTab === 'quiz' ? 'text-gold scale-105' : 'text-slate-500 hover:text-white'}`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-wider">Trials</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default App;
