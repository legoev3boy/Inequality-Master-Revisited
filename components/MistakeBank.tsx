
import React from 'react';
import { MistakeRecord } from '../types';
import { Trash2, ArrowLeft, AlertTriangle, BookOpen } from 'lucide-react';

interface MistakeBankProps {
  mistakes: MistakeRecord[];
  onRemove: (id: string) => void;
  onBack: () => void;
}

export const MistakeBank: React.FC<MistakeBankProps> = ({ mistakes, onRemove, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to Dashboard
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className="bg-red-100 p-3 rounded-xl text-red-600">
           <AlertTriangle size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mistake Bank</h1>
          <p className="text-gray-600">Review your past attempts to analyze where your logic went wrong.</p>
        </div>
      </div>

      {mistakes.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-12 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Clean Sheet!</h2>
            <p className="text-gray-500">You don't have any recorded mistakes yet. Keep up the great work!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {mistakes.map((mistake) => (
            <div key={mistake.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
               <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                     <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded mb-2">
                        {new Date(mistake.timestamp).toLocaleDateString()}
                     </span>
                     <button 
                        onClick={() => onRemove(mistake.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
                     >
                        <Trash2 size={16} /> Remove
                     </button>
                  </div>
                  
                  <p className="text-gray-800 font-medium mb-6 leading-relaxed">
                     {mistake.problem.context}
                  </p>

                  <div className="bg-gray-50 rounded-xl p-4">
                     <p className="text-xs text-red-500 font-bold uppercase tracking-wider mb-1">Your Attempted Inequality</p>
                     <p className="font-mono text-gray-700 break-words font-medium">{mistake.studentInequality}</p>
                  </div>
               </div>
               <div className="bg-indigo-50 px-6 py-3 border-t border-indigo-100">
                  <p className="text-sm text-indigo-800 flex items-center gap-2">
                     <BookOpen size={16} />
                     <strong>Difficulty:</strong> {mistake.problem.difficulty} (Lvl {mistake.problem.level})
                  </p>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
