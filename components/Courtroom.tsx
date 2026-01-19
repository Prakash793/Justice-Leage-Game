
import React, { useState, useEffect, useRef } from 'react';
import { Gavel, ArrowRight, Shield, Sparkles, Book, Target, Scale } from 'lucide-react';
import { generateCaseScenario, getCourtroomInteraction } from '../services/gemini';
import { Role, CaseScenario } from '../types';
import { MOCK_CASES } from '../data/mockCases';

interface CourtroomProps {
  onComplete: (score: number) => void;
}

export const Courtroom: React.FC<CourtroomProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [caseScenario, setCaseScenario] = useState<CaseScenario | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [phase, setPhase] = useState<'Brief' | 'RoleSelection' | 'Live' | 'Verdict'>('RoleSelection');
  const [userInput, setUserInput] = useState('');
  const [courtLog, setCourtLog] = useState<{ role: string; content: string }[]>([]);
  const [score, setScore] = useState(0);
  const [selectionMode, setSelectionMode] = useState<'AI' | 'Curated'>('Curated');
  const logEndRef = useRef<HTMLDivElement>(null);

  const startCase = async (category: string) => {
    setLoading(true);
    try {
      const scenario = await generateCaseScenario(category);
      setCaseScenario(scenario);
      setPhase('Brief');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectMockCase = (scenario: CaseScenario) => {
    setCaseScenario(scenario);
    setPhase('Brief');
  };

  const handleRoleSelection = (selectedRole: Role) => {
    setRole(selectedRole);
    setPhase('Live');
    setCourtLog([{ role: 'Court', content: `The session is now in progress. Counsel for ${selectedRole === 'Advocate' ? 'Defense' : 'Prosecution'}, present your case before the Bench using the new BNS/BNSS framework.` }]);
  };

  const finishSession = () => {
    onComplete(score);
    setPhase('RoleSelection');
    setRole(null);
    setCaseScenario(null);
    setCourtLog([]);
    setScore(0);
  };

  const submitArgument = async () => {
    if (!userInput.trim() || !role || !caseScenario) return;
    
    const newUserArg = { role: 'User', content: userInput };
    setCourtLog([...courtLog, newUserArg]);
    setUserInput('');
    setLoading(true);

    try {
      const aiResponse = await getCourtroomInteraction(role, caseScenario.brief, userInput, courtLog);
      setCourtLog(prev => [...prev, { role: 'Bench', content: aiResponse.response }]);
      setScore(prev => prev + aiResponse.legal_score);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [courtLog]);

  if (phase === 'RoleSelection') {
    return (
      <div className="flex flex-col space-y-8 px-4 py-8">
        <div className="text-center">
          <div className="inline-block p-5 rounded-[2.5rem] bg-gold/10 border border-gold/20 mb-6 shadow-3xl">
            <Gavel className="w-12 h-12 text-gold mx-auto" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">The Arena</h1>
          <p className="text-[10px] font-black text-gold uppercase tracking-mega">Live BNS/BNSS Simulation Circuit</p>
        </div>

        <div className="flex p-1.5 glass rounded-2xl border border-white/5">
          <button 
            onClick={() => setSelectionMode('Curated')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-mega ${selectionMode === 'Curated' ? 'bg-gold text-black shadow-lg' : 'text-slate-500'}`}
          >
            <Book className="w-4 h-4" />
            <span>Classic Trials</span>
          </button>
          <button 
            onClick={() => setSelectionMode('AI')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-mega ${selectionMode === 'AI' ? 'bg-gold text-black shadow-lg' : 'text-slate-500'}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Oracle</span>
          </button>
        </div>

        {selectionMode === 'AI' ? (
          <div className="grid grid-cols-1 w-full gap-5">
            {['BNS (Criminal Law)', 'BNSS (Procedure)', 'BSA (Evidence)', 'Constitution Law'].map((cat) => (
              <button
                key={cat}
                onClick={() => startCase(cat)}
                disabled={loading}
                className="w-full p-6 glass border border-white/5 rounded-[2.2rem] text-left hover:bg-white/10 transition-all flex justify-between items-center group shadow-xl"
              >
                <div>
                  <span className="font-black text-white text-lg block tracking-tight uppercase">{cat}</span>
                  <span className="text-[9px] font-black text-gold uppercase tracking-mega opacity-60">Generate Modern Case</span>
                </div>
                {loading ? (
                  <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ArrowRight className="w-6 h-6 text-gold group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {MOCK_CASES.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => selectMockCase(scenario)}
                className="w-full p-7 glass border border-white/5 rounded-[2.5rem] text-left hover:bg-white/10 transition-all group shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-mega ${
                    scenario.category === 'BNS' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                    scenario.category === 'BNSS' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                    scenario.category === 'BSA' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                    'bg-purple-500/20 text-purple-400 border border-purple-500/20'
                  }`}>
                    {scenario.category}
                  </span>
                </div>
                <h3 className="font-black text-white text-lg mb-2 group-hover:text-gold transition-colors uppercase tracking-tight">{scenario.title}</h3>
                <p className="text-[12px] text-slate-400 line-clamp-2 font-bold leading-relaxed uppercase opacity-70">{scenario.brief}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (phase === 'Brief' && caseScenario) {
    return (
      <div className="space-y-6 pb-20">
        <div className="glass p-10 rounded-b-[3.5rem] relative overflow-hidden shadow-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <button 
            onClick={() => setPhase('RoleSelection')}
            className="text-[10px] font-black text-gold mb-8 flex items-center uppercase tracking-mega hover:translate-x-1 transition-transform"
          >
            <ArrowRight className="w-3 h-3 rotate-180 mr-2" />
            Back to Arena
          </button>
          <h2 className="text-3xl font-black text-white mb-4 leading-tight uppercase tracking-tight">{caseScenario.title}</h2>
          <div className="flex space-x-3">
            <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-mega">Tamil Nadu Jurisdiction</span>
            <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-gold uppercase tracking-mega">{caseScenario.category}</span>
          </div>
        </div>
        
        <div className="px-5 space-y-5">
          <div className="glass p-8 rounded-[2.5rem] shadow-xl">
            <h3 className="text-[11px] font-black text-gold uppercase tracking-mega mb-5 flex items-center">
              <Book className="w-4 h-4 mr-3" />
              Intelligence Brief
            </h3>
            <p className="text-[15px] text-white/90 leading-relaxed font-bold uppercase tracking-tight">{caseScenario.brief}</p>
          </div>
          
          <div className="glass p-8 rounded-[2.5rem] shadow-xl">
            <h3 className="text-[11px] font-black text-gold uppercase tracking-mega mb-5">Core Evidence</h3>
            <ul className="space-y-5">
              {caseScenario.facts.map((fact, i) => (
                <li key={i} className="flex items-start space-x-5">
                  <div className="mt-1.5 h-6 w-1 bg-gold shrink-0 rounded-full opacity-40 shadow-[0_0_8px_gold]" />
                  <span className="text-[13px] text-slate-400 font-bold leading-relaxed uppercase">{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-mega mb-8">Enter Courtroom as</p>
            <div className="grid grid-cols-2 gap-5">
              <button 
                onClick={() => handleRoleSelection('Public Prosecutor')}
                className="p-8 bg-slate-800 text-white rounded-[2.8rem] font-black flex flex-col items-center space-y-4 border border-white/10 shadow-3xl active:scale-95 transition-all"
              >
                <Shield className="w-10 h-10 text-gold" />
                <span className="text-[11px] uppercase tracking-mega">Prosecutor</span>
              </button>
              <button 
                onClick={() => handleRoleSelection('Advocate')}
                className="p-8 bg-gold text-slate-900 rounded-[2.8rem] font-black flex flex-col items-center space-y-4 shadow-3xl active:scale-95 transition-all"
              >
                <Target className="w-10 h-10 text-black" />
                <span className="text-[11px] uppercase tracking-mega text-black">Counsel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-black/20">
      <div className="glass-dark border-b border-white/10 px-6 py-5 flex justify-between items-center shrink-0 shadow-2xl z-10">
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 bg-gold/20 rounded-2xl flex items-center justify-center border border-gold/40 shadow-inner">
            <Gavel className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h4 className="text-[11px] font-black text-white truncate max-w-[140px] uppercase tracking-mega">{caseScenario?.title}</h4>
            <p className="text-[9px] text-gold font-black uppercase tracking-mega mt-0.5">{role}</p>
          </div>
        </div>
        <div className="flex items-center space-x-5">
           <button 
            onClick={finishSession}
            className="px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-[10px] font-black uppercase tracking-mega hover:bg-red-500/20 active:scale-90 transition-all"
           >
             Exit
           </button>
          <div className="text-right">
            <p className="text-[8px] text-slate-500 uppercase font-black tracking-mega mb-1">XP Points</p>
            <p className="text-2xl font-black text-white leading-none">{score}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-slate-950/30">
        {courtLog.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'User' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[85%] p-6 rounded-[2.5rem] shadow-3xl text-[13px] leading-relaxed transition-all ${
              msg.role === 'User' 
                ? 'bg-gold text-slate-900 rounded-tr-none font-black uppercase tracking-tight animate-in zoom-in-95' 
                : msg.role === 'Bench' 
                ? 'bg-white/10 text-white rounded-tl-none border border-white/5 backdrop-blur-3xl font-bold'
                : 'bg-black/60 text-slate-500 border border-white/5 italic text-center mx-auto py-3 px-10 rounded-full text-[10px] uppercase tracking-mega font-black'
            }`}>
              {msg.role !== 'User' && msg.role !== 'Court' && (
                <div className="flex items-center space-x-2 mb-3 text-gold opacity-80">
                  <Scale className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-mega">{msg.role}</span>
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-white/5 p-4 px-8 rounded-full text-slate-500 animate-pulse text-[10px] font-black uppercase tracking-mega border border-white/10 backdrop-blur-md">
              Consulting Law Digest...
            </div>
          </div>
        )}
        <div ref={logEndRef} />
      </div>

      <div className="p-6 glass-dark border-t border-white/10 shrink-0 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitArgument()}
            placeholder="CITE BNS SECTION OR PRESENT FACTS..."
            className="flex-1 bg-white/5 border border-white/10 rounded-[1.8rem] px-8 py-5 text-[11px] font-black text-white focus:ring-2 focus:ring-gold focus:outline-none placeholder:text-slate-700 shadow-inner uppercase tracking-tight"
          />
          <button 
            onClick={submitArgument}
            disabled={loading || !userInput.trim()}
            className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-black disabled:opacity-20 shadow-3xl active:scale-90 transition-all hover:scale-105"
          >
            <ArrowRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};
