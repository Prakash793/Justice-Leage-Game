
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
    setCourtLog([{ role: 'Court', content: `The session is now in progress. Counsel for ${selectedRole === 'Advocate' ? 'Defense' : 'Prosecution'}, present your case before the Bench.` }]);
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
          <div className="inline-block p-4 rounded-[2rem] bg-gold/10 border border-gold/20 mb-6 shadow-2xl">
            <Gavel className="w-12 h-12 text-gold mx-auto" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">The Arena</h1>
          <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Live Simulation Circuit</p>
        </div>

        <div className="flex p-1.5 glass rounded-2xl border border-white/5">
          <button 
            onClick={() => setSelectionMode('Curated')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${selectionMode === 'Curated' ? 'bg-gold text-black shadow-lg' : 'text-slate-500'}`}
          >
            <Book className="w-4 h-4" />
            <span>Classics</span>
          </button>
          <button 
            onClick={() => setSelectionMode('AI')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${selectionMode === 'AI' ? 'bg-gold text-black shadow-lg' : 'text-slate-500'}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Oracle</span>
          </button>
        </div>

        {selectionMode === 'AI' ? (
          <div className="grid grid-cols-1 w-full gap-4">
            {['IPC Criminal', 'Civil Procedure', 'Constitutional Law'].map((cat) => (
              <button
                key={cat}
                onClick={() => startCase(cat)}
                disabled={loading}
                className="w-full p-6 glass border border-white/5 rounded-[2rem] text-left hover:bg-white/10 transition-all flex justify-between items-center group"
              >
                <div>
                  <span className="font-bold text-white text-lg block">{cat}</span>
                  <span className="text-[10px] font-black text-gold uppercase tracking-widest opacity-60">Neural Generation Ready</span>
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
          <div className="space-y-4">
            {MOCK_CASES.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => selectMockCase(scenario)}
                className="w-full p-6 glass border border-white/5 rounded-[2rem] text-left hover:bg-white/10 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    scenario.category === 'IPC' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                    scenario.category === 'CPC' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                    'bg-purple-500/20 text-purple-400 border border-purple-500/20'
                  }`}>
                    {scenario.category}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base mb-2 group-hover:text-gold transition-colors">{scenario.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 font-medium leading-relaxed">{scenario.brief}</p>
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
        <div className="glass p-10 rounded-b-[3rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <button 
            onClick={() => setPhase('RoleSelection')}
            className="text-[10px] font-black text-gold mb-6 flex items-center uppercase tracking-widest hover:translate-x-1 transition-transform"
          >
            <ArrowRight className="w-3 h-3 rotate-180 mr-2" />
            Back to Roster
          </button>
          <h2 className="text-3xl font-serif font-bold text-white mb-3 leading-tight">{caseScenario.title}</h2>
          <div className="flex space-x-3">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-widest">Madras Jurisdiction</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-gold uppercase tracking-widest">{caseScenario.category}</span>
          </div>
        </div>
        
        <div className="px-4 space-y-4">
          <div className="glass p-6 rounded-[2rem]">
            <h3 className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-4 flex items-center">
              <Book className="w-4 h-4 mr-2" />
              Intelligence Brief
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">{caseScenario.brief}</p>
          </div>
          
          <div className="glass p-6 rounded-[2rem]">
            <h3 className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-4">Core Evidence</h3>
            <ul className="space-y-4">
              {caseScenario.facts.map((fact, i) => (
                <li key={i} className="flex items-start space-x-4">
                  <div className="mt-1 h-6 w-1 bg-gold shrink-0 rounded-full opacity-30" />
                  <span className="text-xs text-slate-400 font-medium leading-relaxed">{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6">
            <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Initiate Protocol</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleRoleSelection('Public Prosecutor')}
                className="p-6 bg-slate-800 text-white rounded-[2rem] font-black flex flex-col items-center space-y-3 border border-white/5 shadow-2xl active:scale-95 transition-all"
              >
                <Shield className="w-8 h-8 text-gold" />
                <span className="text-[10px] uppercase tracking-widest">Prosecution</span>
              </button>
              <button 
                onClick={() => handleRoleSelection('Advocate')}
                className="p-6 bg-gold text-slate-900 rounded-[2rem] font-black flex flex-col items-center space-y-3 shadow-2xl active:scale-95 transition-all"
              >
                <Target className="w-8 h-8 text-black" />
                <span className="text-[10px] uppercase tracking-widest text-black">Defense</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-black/20">
      <div className="glass-dark border-b border-white/10 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gold/20 rounded-2xl flex items-center justify-center border border-gold/30">
            <Gavel className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white truncate max-w-[140px] uppercase tracking-wider">{caseScenario?.title}</h4>
            <p className="text-[9px] text-gold font-black uppercase tracking-widest">{role}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
           <button 
            onClick={finishSession}
            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/40 rounded-xl text-[9px] font-black uppercase tracking-widest"
           >
             End
           </button>
          <div className="text-right">
            <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">XP Points</p>
            <p className="text-xl font-black text-white leading-none">{score}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {courtLog.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'User' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-5 rounded-[2rem] shadow-2xl text-xs font-medium leading-relaxed ${
              msg.role === 'User' 
                ? 'bg-gold text-slate-900 rounded-tr-none font-bold' 
                : msg.role === 'Bench' 
                ? 'bg-white/10 text-white rounded-tl-none border border-white/5 backdrop-blur-md'
                : 'bg-black/40 text-slate-500 border border-white/5 italic text-center mx-auto py-2 px-8 rounded-full text-[10px] uppercase tracking-widest font-black'
            }`}>
              {msg.role !== 'User' && msg.role !== 'Court' && (
                <div className="flex items-center space-x-2 mb-2 text-gold opacity-80">
                  <Scale className="w-3 h-3" />
                  <span className="text-[9px] font-black uppercase tracking-widest">{msg.role}</span>
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-4 rounded-full text-slate-500 animate-pulse text-[10px] font-black uppercase tracking-widest border border-white/5">
              Processing legal strategy...
            </div>
          </div>
        )}
        <div ref={logEndRef} />
      </div>

      <div className="p-6 glass-dark border-t border-white/10 shrink-0">
        <div className="flex items-center space-x-3 mb-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitArgument()}
            placeholder="Dictate protocol or cite statutes..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:ring-2 focus:ring-gold focus:outline-none placeholder:text-slate-600 shadow-inner"
          />
          <button 
            onClick={submitArgument}
            disabled={loading || !userInput.trim()}
            className="w-14 h-14 bg-gold rounded-2xl flex items-center justify-center text-black disabled:opacity-30 shadow-2xl active:scale-90 transition-all"
          >
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
