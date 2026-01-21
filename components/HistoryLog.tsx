
import React from 'react';
import { UserHistoryItem } from '../types';
import { ArrowLeft, History, CheckCircle, XCircle } from 'lucide-react';

interface HistoryLogProps {
  history: UserHistoryItem[];
  onBack: () => void;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ history, onBack }) => {
  const totalSolved = history.length;
  const totalCorrect = history.filter(h => h.isCorrect).length;
  const accuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;
  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

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
        <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
           <History size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All-Time History</h1>
          <p className="text-gray-600">Track every problem you've attempted.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center">
            <span className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Problems</span>
            <span className="text-4xl font-bold text-gray-900">{totalSolved}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center">
            <span className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Accuracy</span>
            <span className={`text-4xl font-bold ${
                accuracy >= 80 ? 'text-green-600' : accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>{accuracy}%</span>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-12 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">No History Yet</h2>
            <p className="text-gray-500">Start practicing to see your progress log here!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Result</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Level</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedHistory.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {item.isCorrect ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                            <CheckCircle size={14} /> Correct
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                            <XCircle size={14} /> Incorrect
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded text-xs">
                                        {item.level}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(item.timestamp).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};
