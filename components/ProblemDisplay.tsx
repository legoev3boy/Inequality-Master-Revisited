
import React from 'react';
import { MathProblem } from '../types';
import { BookOpen, Target } from 'lucide-react';

interface ProblemDisplayProps {
  problem: MathProblem;
}

export const ProblemDisplay: React.FC<ProblemDisplayProps> = ({ problem }) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${
              problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {problem.difficulty} Mode
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Lvl {problem.level}
            </span>
          </div>
          <BookOpen size={20} className="text-gray-300" />
        </div>
        
        <p className="text-xl text-gray-800 leading-relaxed font-semibold mb-6">
          {problem.context}
        </p>

        <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-indigo-100 shadow-lg flex items-start gap-3">
          <div className="bg-white/20 p-2 rounded-lg shrink-0">
            <Target size={20} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-0.5">Your Mission</p>
            <p className="text-sm font-medium leading-snug">
              Write an inequality to find <span className="font-mono bg-white/20 px-1 rounded">{problem.variableName}</span>, representing {problem.variableDescription}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
