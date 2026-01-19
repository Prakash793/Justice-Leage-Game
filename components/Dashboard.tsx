
import React from 'react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Award, BookOpen, Zap, TrendingUp, Clock, Target, Rocket, Shield, Gavel, LogOut, Scale } from 'lucide-react';
import { User } from '../types';
import { BrandLogo } from './BrandLogo';

const data = [
  { name: 'M', score: 400 },
  { name: 'T', score: 300 },
  { name: 'W', score: 600 },
  { name: 'T', score: 800 },
  { name: 'F', score: 500 },
  { name: 'S', score: 900 },
  { name: 'S', score: 700 },
];

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  return (
    <div className="space-y-6 px-4 py-6">
      {/* Profile HUD */}
      <div className="glass p-6 rounded-[2.5rem] relative overflow-hidden group border-gold/10">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Rocket className="w-24 h-24" />
        </div>
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center space-x-5">
            <div className="h-20 w-20 rounded-3xl bg-gold/20 flex items-center justify-center text-gold text-3xl font-black border border-gold/30 rotate-3 group-hover:rotate-0 transition-all shadow-xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">{user.name}</h1>
              <p className="text-[10px] font-black text-gold/80 uppercase tracking-widest flex items-center mb-3">
                <Shield className="w-3 h-3 mr-1" />
                {user.rank}
              </p>
              <button 
                onClick={onLogout}
                className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase rounded-full flex items-center space-x-1 hover:bg-red-500/20 active:scale-90 transition-all shadow-lg"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout Session</span>
              </button>
            </div>
          </div>
          
          <div className="w-16 h-16 drop-shadow-2xl">
             <BrandLogo />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-8">
          {[
            { label: 'Power', val: user.totalPoints, icon: <Zap className="w-3 h-3" /> },
            { label: 'Trials', val: user.casesResolved, icon: <Gavel className="w-3 h-3" /> },
            { label: 'Exams', val: user.completedQuizzes, icon: <BookOpen className="w-3 h-3" /> },
          ].map((stat, i) => (
            <div key={i} className="text-center p-3 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-xl font-black text-white">{stat.val}</p>
              <div className="flex items-center justify-center space-x-1 opacity-50">
                {stat.icon}
                <span className="text-[8px] font-black uppercase tracking-widest">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Progress */}
      <div className="glass p-6 rounded-[2.5rem]">
        <h2 className="text-sm font-black text-white mb-6 flex items-center uppercase tracking-widest">
          <TrendingUp className="w-4 h-4 mr-2 text-gold" />
          Neural Growth
        </h2>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{fill: 'rgba(255,255,255,0.4)'}} />
              <Tooltip 
                contentStyle={{background: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px'}}
                itemStyle={{color: '#fbbf24'}}
              />
              <Bar dataKey="score" radius={[6, 6, 6, 6]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 5 ? '#fbbf24' : 'rgba(255,255,255,0.1)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] flex flex-col justify-between h-36 hover:bg-white/10 transition-all">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-wide">Next Mission</h3>
            <p className="text-[10px] text-slate-400">Civil Code Trials</p>
          </div>
        </div>
        <div className="bg-gold p-5 rounded-[2rem] flex flex-col justify-between h-36 hover:scale-95 transition-all shadow-xl">
          <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-black text-sm text-black uppercase tracking-wide">Daily Blitz</h3>
            <p className="text-[10px] text-black/60 font-bold">Constitutional Quiz</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass p-6 rounded-[2.5rem]">
        <h2 className="text-sm font-black text-white mb-4 uppercase tracking-widest">Medals Earned</h2>
        <div className="flex space-x-5 overflow-x-auto pb-2 no-scrollbar">
          {[
            { icon: <Zap />, label: 'Relentless', color: 'bg-gold text-black' },
            { icon: <Award />, label: 'Grand Counsel', color: 'bg-white/10 text-white' },
            { icon: <Clock />, label: 'Night Hawk', color: 'bg-white/10 text-white' },
            { icon: <Shield />, label: 'Guardian', color: 'bg-white/10 text-white' },
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center min-w-[70px] space-y-2">
              <div className={`p-4 rounded-3xl ${badge.color} shadow-lg shadow-black/20 transform hover:scale-110 transition-transform`}>
                {badge.icon}
              </div>
              <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
