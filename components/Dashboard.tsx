
import React, { useRef } from 'react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Award, BookOpen, Zap, TrendingUp, Clock, Target, Rocket, Shield, Gavel, LogOut, Camera, Sun, Moon } from 'lucide-react';
import { User, Theme } from '../types';
import { BrandLogo } from './BrandLogo';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
}

const data = [
  { name: 'M', score: 400 },
  { name: 'T', score: 300 },
  { name: 'W', score: 600 },
  { name: 'T', score: 800 },
  { name: 'F', score: 500 },
  { name: 'S', score: 900 },
  { name: 'S', score: 700 },
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUpdateUser }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTheme = () => {
    const newTheme: Theme = user.theme === 'light' ? 'dark' : 'light';
    onUpdateUser({ theme: newTheme });
  };

  return (
    <div className="space-y-6 px-4 py-8 pb-32">
      {/* Profile HUD */}
      <div className="glass p-7 rounded-[3rem] relative overflow-hidden group border-white/5">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Rocket className="w-24 h-24" />
        </div>
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center space-x-6">
            <div className="relative group/img">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="h-20 w-20 rounded-[1.8rem] bg-gold/10 flex items-center justify-center text-gold text-2xl font-black border-2 border-gold/30 rotate-3 group-hover:rotate-0 transition-all shadow-2xl overflow-hidden cursor-pointer"
              >
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-xl font-black tracking-tight text-white uppercase">{user.name}</h1>
              <p className="text-[9px] font-black text-gold uppercase tracking-mega flex items-center mb-3">
                <Shield className="w-3 h-3 mr-2" />
                {user.rank}
              </p>
              
              <div className="flex space-x-2 pt-1">
                <button 
                  onClick={onLogout}
                  className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-black uppercase tracking-mega rounded-xl flex items-center space-x-2 hover:bg-red-500/20 active:scale-90 transition-all shadow-lg"
                >
                  <LogOut className="w-2.5 h-2.5" />
                  <span>Logout</span>
                </button>
                <button 
                  onClick={toggleTheme}
                  className="px-3 py-1.5 bg-gold/10 border border-gold/20 text-gold text-[8px] font-black uppercase tracking-mega rounded-xl flex items-center space-x-2 hover:bg-gold/20 active:scale-90 transition-all shadow-lg"
                >
                  {user.theme === 'light' ? <Moon className="w-2.5 h-2.5" /> : <Sun className="w-2.5 h-2.5" />}
                  <span>{user.theme === 'light' ? 'Dark' : 'Light'}</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="w-14 h-14 drop-shadow-2xl opacity-60">
             <BrandLogo />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mt-8">
          {[
            { label: 'POWER', val: user.totalPoints, icon: <Zap className="w-3 h-3" /> },
            { label: 'TRIALS', val: user.casesResolved, icon: <Gavel className="w-3 h-3" /> },
            { label: 'EXAMS', val: user.completedQuizzes, icon: <BookOpen className="w-3 h-3" /> },
          ].map((stat, i) => (
            <div key={i} className="text-center p-3 rounded-[1.5rem] bg-white/5 border border-white/5 backdrop-blur-md">
              <p className="text-xl font-black text-white">{stat.val}</p>
              <div className="flex items-center justify-center space-x-1 opacity-50 mt-1">
                {stat.icon}
                <span className="text-[7px] font-black uppercase tracking-mega">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Progress */}
      <div className="glass p-7 rounded-[3rem] border-white/5">
        <h2 className="text-[10px] font-black mb-6 flex items-center uppercase tracking-mega text-slate-400">
          <TrendingUp className="w-4 h-4 mr-2 text-gold" />
          Neural Growth Capacity
        </h2>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" fontSize={8} fontWeight={800} tickLine={false} axisLine={false} tick={{fill: 'currentColor', opacity: 0.3}} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)', radius: 8}}
                contentStyle={{background: 'var(--glass-dark-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase'}}
                itemStyle={{color: '#fbbf24'}}
              />
              <Bar dataKey="score" radius={[6, 6, 6, 6]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 5 ? '#fbbf24' : 'rgba(255,255,255,0.08)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col justify-between h-36 hover:bg-white/10 transition-all group shadow-xl">
          <div className="w-10 h-10 bg-gold/10 rounded-2xl flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
            <Target className="w-5 h-5 text-gold group-hover:text-black" />
          </div>
          <div>
            <h3 className="font-black text-[11px] uppercase tracking-mega text-white">Next Mission</h3>
            <p className="text-[8px] opacity-40 font-bold uppercase tracking-mega mt-1">Civil Code Trials</p>
          </div>
        </div>
        <div className="bg-gold p-6 rounded-[2.5rem] flex flex-col justify-between h-36 hover:scale-95 transition-all shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-3 -top-3 opacity-10 group-hover:scale-150 transition-transform duration-1000">
            <Zap className="w-20 h-20 text-black" />
          </div>
          <div className="w-10 h-10 bg-black/10 rounded-2xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="font-black text-[11px] text-black uppercase tracking-mega">Daily Blitz</h3>
            <p className="text-[8px] text-black/60 font-black uppercase tracking-mega mt-1">Constitutional Law</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass p-7 rounded-[3rem] border-white/5">
        <h2 className="text-[10px] font-black mb-5 uppercase tracking-mega text-slate-400">Medals Earned</h2>
        <div className="flex space-x-5 overflow-x-auto pb-2 no-scrollbar px-1">
          {[
            { icon: <Zap />, label: 'RELENTLESS', color: 'bg-gold text-black shadow-gold/30' },
            { icon: <Award />, label: 'GRAND COUNSEL', color: 'bg-white/10 text-current' },
            { icon: <Clock />, label: 'NIGHT HAWK', color: 'bg-white/10 text-current' },
            { icon: <Shield />, label: 'GUARDIAN', color: 'bg-white/10 text-current' },
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center min-w-[70px] space-y-2.5">
              <div className={`p-4 rounded-[1.5rem] ${badge.color} shadow-2xl transform hover:scale-110 transition-transform border border-white/5`}>
                {React.cloneElement(badge.icon as React.ReactElement, { size: 20 })}
              </div>
              <span className="text-[7px] font-black uppercase tracking-mega opacity-50 text-center leading-tight">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
