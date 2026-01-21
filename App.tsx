
import React, { useState, useEffect, useRef } from 'react';
import { generateMathProblem, evaluateSubmission, generateVisualProblem } from './services/geminiService';
import { MathProblem, EvaluationResult, UserHistoryItem, MistakeRecord, DailyStats, Character } from './types';
import { soundService } from './services/soundService';
import { Button } from './components/Button';
import { ProblemDisplay } from './components/ProblemDisplay';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { Tutorial } from './components/Tutorial';
import { ScratchPad } from './components/ScratchPad';
import { MistakeBank } from './components/MistakeBank';
import { HistoryLog } from './components/HistoryLog';
import { Shop } from './components/Shop';
import { Calculator, PencilRuler, House, Trophy, Minus, Plus, Camera, Scan, X, ShoppingBag, Sparkles, MoveHorizontal } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'welcome' | 'practice' | 'tutorial' | 'mistake-bank' | 'history' | 'shop'>('welcome');
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [character, setCharacter] = useState<Character>({
    name: 'Student',
    avatar: '🎓',
    color: 'bg-indigo-500',
    unlockedItems: ['🎓', 'bg-indigo-500']
  });
  const [mistakeBank, setMistakeBank] = useState<MistakeRecord[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats>({});
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [studentProcess, setStudentProcess] = useState('');
  const [studentInequality, setStudentInequality] = useState('');
  const [studentSolution, setStudentSolution] = useState('');
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);
  const [history, setHistory] = useState<UserHistoryItem[]>([]);
  const [showScratchPad, setShowScratchPad] = useState(false);
  
  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scrubber State
  const [isScrubbing, setIsScrubbing] = useState(false);
  const startX = useRef(0);
  const startLevel = useRef(1);

  useEffect(() => {
    const savedLevel = localStorage.getItem('im_level');
    const savedHistory = localStorage.getItem('im_history');
    const savedMistakes = localStorage.getItem('im_mistakes');
    const savedStats = localStorage.getItem('im_daily_stats');
    const savedStreak = localStorage.getItem('im_streak');
    const savedPoints = localStorage.getItem('im_points');
    const savedChar = localStorage.getItem('im_character');
    
    if (savedLevel) setLevel(parseInt(savedLevel));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedMistakes) setMistakeBank(JSON.parse(savedMistakes));
    if (savedStats) setDailyStats(JSON.parse(savedStats));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedPoints) setPoints(parseInt(savedPoints));
    if (savedChar) setCharacter(JSON.parse(savedChar));
  }, []);

  useEffect(() => {
    localStorage.setItem('im_level', level.toString());
    localStorage.setItem('im_history', JSON.stringify(history));
    localStorage.setItem('im_mistakes', JSON.stringify(mistakeBank));
    localStorage.setItem('im_daily_stats', JSON.stringify(dailyStats));
    localStorage.setItem('im_streak', streak.toString());
    localStorage.setItem('im_points', points.toString());
    localStorage.setItem('im_character', JSON.stringify(character));
  }, [level, history, mistakeBank, dailyStats, streak, points, character]);

  const resetInputs = () => {
    setFeedback(null);
    setStudentProcess('');
    setStudentInequality('');
    setStudentSolution('');
    setShowScratchPad(false);
    setAttempts(1);
  };

  const fetchNewProblem = async () => {
    setIsLoading(true);
    setCurrentProblem(null);
    resetInputs();
    try {
      const problem = await generateMathProblem(level);
      setCurrentProblem(problem);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access denied", err);
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const captureAndGenerate = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    setIsLoading(true);
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context?.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    stopCamera();
    setCurrentProblem(null);
    resetInputs();

    try {
      const problem = await generateVisualProblem(level, base64);
      setCurrentProblem(problem);
    } catch (error) {
      console.error(error);
      fetchNewProblem();
    } finally {
      setIsLoading(false);
    }
  };

  const startPractice = () => {
    setView('practice');
    if (!currentProblem) fetchNewProblem();
  };

  const changeLevel = (newVal: number) => {
    const sanitized = Math.max(1, Math.min(100, newVal));
    setLevel(sanitized);
    if (view === 'practice') fetchNewProblem();
  };

  // Scrubber Logic
  const handleScrubStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsScrubbing(true);
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startLevel.current = level;
    document.body.style.cursor = 'ew-resize';
  };

  useEffect(() => {
    if (!isScrubbing) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const diff = Math.floor((currentX - startX.current) / 10);
      const newLevel = Math.max(1, Math.min(100, startLevel.current + diff));
      if (newLevel !== level) {
        setLevel(newLevel);
      }
    };

    const handleMouseUp = () => {
      setIsScrubbing(false);
      document.body.style.cursor = 'default';
      if (view === 'practice') fetchNewProblem();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isScrubbing, level, view]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProblem || !studentInequality.trim()) return;
    setIsLoading(true);
    try {
      const result = await evaluateSubmission(currentProblem, studentProcess, studentInequality, studentSolution);
      setFeedback(result);
      
      const today = new Date().toISOString().split('T')[0];
      const diffMap = { 'Easy': 10, 'Medium': 20, 'Hard': 30 };
      const basePoints = diffMap[currentProblem.difficulty] || 10;

      if (result.isCorrect) {
        soundService.playSuccess();
        // Points = (Base / Attempts) * (CurrentStreak + 1)
        const streakBonus = streak + 1;
        const earned = Math.floor((basePoints / attempts) * streakBonus);
        
        setPoints(p => p + earned);
        setLevel(l => Math.min(100, l + 1));
        setStreak(s => s + 1);
        
        setDailyStats(prev => {
          const curr = prev[today] || { correct: 0, incorrect: 0, points: 0 };
          return { ...prev, [today]: { ...curr, correct: curr.correct + 1, points: curr.points + earned } };
        });

        setHistory(prev => [...prev, { 
          problemId: currentProblem.id, 
          isCorrect: true, 
          timestamp: Date.now(), 
          level: currentProblem.level,
          pointsEarned: earned
        }]);
      } else {
        soundService.playFailure();
        setAttempts(a => a + 1);
        setLevel(l => Math.max(1, l - 1));
        setStreak(0);
        
        setDailyStats(prev => {
          const curr = prev[today] || { correct: 0, incorrect: 0, points: 0 };
          return { ...prev, [today]: { ...curr, incorrect: curr.incorrect + 1 } };
        });

        setHistory(prev => [...prev, { problemId: currentProblem.id, isCorrect: false, timestamp: Date.now(), level: currentProblem.level }]);
        setMistakeBank(prev => [{ id: crypto.randomUUID(), problem: currentProblem, studentInequality, correctInequality: result.correctInequality, timestamp: Date.now() }, ...prev]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (view === 'welcome') {
    const today = new Date().toISOString().split('T')[0];
    const todaysStats = dailyStats[today] || { correct: 0, incorrect: 0, points: 0 };
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white max-w-2xl w-full rounded-[2.5rem] shadow-2xl overflow-hidden text-center p-8 md:p-12 relative">
          <button 
            onClick={() => setView('shop')}
            className="absolute top-6 right-6 flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-full font-bold hover:bg-amber-100 transition-all border border-amber-100"
          >
            <ShoppingBag size={18} /> {points} Pts
          </button>

          <div className="inline-flex flex-col items-center mb-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white mb-2 ${character.color}`}>
              {character.avatar}
            </div>
            <p className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Welcome Back, {character.name}</p>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Inequality Master</h1>
          <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto">Master math and unlock gear for your character!</p>
          
          <div className="mb-10 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left space-y-1">
                <p className="font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles size={20} className="text-amber-500" /> Stats
                </p>
                <div className="flex gap-4">
                    <span className="text-sm font-medium text-gray-500">🔥 {streak} Streak</span>
                    <span className="text-sm font-medium text-emerald-600">✅ {todaysStats.correct} Solved</span>
                    <span className="text-sm font-medium text-amber-600 font-bold">✨ {todaysStats.points} Earned</span>
                </div>
              </div>

              <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 min-w-[160px]">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Set Level (Scrub)</span>
                <div className="flex items-center gap-4">
                    <button onClick={() => changeLevel(level - 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-indigo-50 text-indigo-600 transition-colors"><Minus size={18} /></button>
                    <div 
                      onMouseDown={handleScrubStart}
                      onTouchStart={handleScrubStart}
                      className="text-4xl font-black text-indigo-600 tabular-nums cursor-ew-resize select-none hover:bg-indigo-50 px-3 rounded-xl transition-colors flex flex-col items-center"
                    >
                      {level}
                      <MoveHorizontal size={12} className="opacity-30" />
                    </div>
                    <button onClick={() => changeLevel(level + 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-indigo-50 text-indigo-600 transition-colors"><Plus size={18} /></button>
                </div>
                <div className="w-32 mt-2">
                    <input 
                        type="range" min="1" max="100" value={level} 
                        onChange={(e) => changeLevel(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button onClick={startPractice} className="md:col-span-2 py-4 text-lg">Practice Now</Button>
            <Button onClick={() => setView('shop')} variant="secondary" className="bg-amber-500 hover:bg-amber-600">Enter Shop</Button>
            <Button onClick={() => setView('tutorial')} variant="outline">Tutorial</Button>
            {mistakeBank.length > 0 && <Button onClick={() => setView('mistake-bank')} variant="danger" className="md:col-span-2">Mistake Bank ({mistakeBank.length})</Button>}
            <Button onClick={() => setView('history')} variant="outline" className="md:col-span-2">Full Progress Log</Button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'mistake-bank') return <MistakeBank mistakes={mistakeBank} onRemove={id => setMistakeBank(m => m.filter(x => x.id !== id))} onBack={() => setView('welcome')} />;
  if (view === 'history') return <HistoryLog history={history} onBack={() => setView('welcome')} />;
  if (view === 'tutorial') return <Tutorial onBack={() => setView('welcome')} />;
  if (view === 'shop') return <Shop points={points} character={character} onSpendPoints={(amt) => setPoints(p => p - amt)} onUpdateCharacter={setCharacter} onBack={() => setView('welcome')} />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 h-16 flex items-center">
        <div className="max-w-4xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer font-bold text-xl" onClick={() => setView('welcome')}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm ${character.color}`}>
               {character.avatar}
             </div>
             <span>Inequality Master</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
             <div className="flex items-center gap-3">
                <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  <Sparkles size={14} /> {points}
                </span>
                <span 
                  onMouseDown={handleScrubStart}
                  onTouchStart={handleScrubStart}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold cursor-ew-resize select-none flex items-center gap-1"
                >
                  Lvl {level} <MoveHorizontal size={10} className="opacity-50" />
                </span>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">{streak} 🔥</span>
             </div>
             <button onClick={() => setView('welcome')} className="text-gray-400 hover:text-indigo-600"><House size={20} /></button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {showCamera && (
           <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 animate-fade-in">
              <button onClick={stopCamera} className="absolute top-6 right-6 text-white bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors">
                <X size={24} />
              </button>
              <div className="relative w-full max-w-lg aspect-[3/4] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                 <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                 <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="mt-8 flex flex-col items-center gap-4">
                <p className="text-white font-medium text-center px-8">Point at your desk or room objects to generate a visual challenge.</p>
                <button 
                  onClick={captureAndGenerate} 
                  disabled={isLoading}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform disabled:opacity-50"
                >
                   <div className="w-16 h-16 border-4 border-gray-200 rounded-full flex items-center justify-center">
                      <Scan size={32} className="text-indigo-600" />
                   </div>
                </button>
              </div>
           </div>
        )}

        {currentProblem ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Challenge</h2>
                {attempts > 1 && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Attempt #{attempts}</span>
                )}
                {streak > 0 && (
                  <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded animate-pulse">{streak + 1}x STREAK BONUS</span>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={startCamera} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-100 transition-colors">
                  <Camera size={16} /> Scan Room
                </button>
                <button onClick={() => setShowScratchPad(!showScratchPad)} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border ${showScratchPad ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-600'}`}>
                  <PencilRuler size={16} /> Scratchpad
                </button>
              </div>
            </div>
            
            <ProblemDisplay problem={currentProblem} />
            {showScratchPad && <ScratchPad />}
            
            {feedback ? (
              <FeedbackDisplay result={feedback} onNext={fetchNewProblem} onRetry={() => setFeedback(null)} />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Reasoning Plan</label>
                  <textarea value={studentProcess} onChange={e => setStudentProcess(e.target.value)} className="w-full h-24 p-4 rounded-2xl border-2 border-gray-50 focus:border-indigo-100 focus:outline-none transition-colors resize-none" placeholder="Describe the steps to build your model..." disabled={isLoading} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Inequality Model</label>
                    <input type="text" value={studentInequality} onChange={e => setStudentInequality(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-50 focus:border-indigo-100 focus:outline-none transition-colors font-mono text-indigo-600" placeholder="e.g. 5x - 10 > 40" disabled={isLoading} />
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Final Solution</label>
                    <input type="text" value={studentSolution} onChange={e => setStudentSolution(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-50 focus:border-indigo-100 focus:outline-none transition-colors font-mono text-emerald-600" placeholder="e.g. x > 10" disabled={isLoading} />
                  </div>
                </div>
                <Button type="submit" className="w-full py-4 text-lg rounded-3xl shadow-indigo-100 shadow-xl" isLoading={isLoading} disabled={!studentInequality.trim()}>Validate Model</Button>
              </form>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
             <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-6"></div>
             <p className="text-gray-400 font-bold text-lg tracking-tight">Designing a Lvl {level} challenge...</p>
             <button onClick={startCamera} className="mt-8 px-6 py-3 bg-indigo-50 text-indigo-700 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-100">
               <Camera size={20} /> Use Camera Instead
             </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
