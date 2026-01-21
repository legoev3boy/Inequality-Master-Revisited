
import React, { useState } from 'react';
import { EvaluationResult } from '../types';
import { CheckCircle, XCircle, Lightbulb, RefreshCcw, HelpCircle } from 'lucide-react';

interface FeedbackDisplayProps {
  result: EvaluationResult;
  onNext: () => void;
  onRetry: () => void;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ result, onNext, onRetry }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const isCorrect = result.isCorrect;
  const isFeedbackVisible = isCorrect || showFeedback;

  return (
    <div className={`rounded-2xl shadow-lg border-2 p-6 md:p-8 mb-8 animate-fade-in-up ${
      isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-start gap-4 mb-4">
        {isCorrect ? (
          <CheckCircle className="text-green-600 flex-shrink-0" size={32} />
        ) : (
          <XCircle className="text-red-600 flex-shrink-0" size={32} />
        )}
        <div className="w-full">
          <h3 className={`text-xl font-bold mb-2 ${
            isCorrect ? 'text-green-800' : 'text-red-800'
          }`}>
            {isCorrect ? 'Great Job!' : 'Incorrect'}
          </h3>
          
          {isFeedbackVisible ? (
             <div className="animate-fade-in">
               <p className="text-gray-700 leading-relaxed mb-4">
                  {result.feedback}
               </p>
               {!isCorrect && result.tips.length > 0 && (
                 <div className="bg-white/60 p-4 rounded-lg border border-red-100 text-sm">
                    <h4 className="flex items-center gap-2 font-bold text-red-800 mb-2">
                      <Lightbulb size={16} /> Helpful Hints
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {result.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                 </div>
               )}
             </div>
          ) : (
             <p className="text-gray-500 italic">
               The answer is not correct. Try again or view hints to refine your model.
             </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end flex-wrap">
        {!isCorrect && (
          <>
             <button 
              onClick={onRetry}
              className="px-4 py-3 rounded-xl font-bold text-indigo-700 bg-white border-2 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <RefreshCcw size={18} />
              Try Again
            </button>
            
            {!isFeedbackVisible && (
                <button 
                onClick={() => setShowFeedback(true)}
                className="px-4 py-3 rounded-xl font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 border-2 border-amber-200 transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
                >
                <HelpCircle size={18} />
                Show Hints
                </button>
            )}
          </>
        )}

        {isCorrect && (
          <button 
            onClick={onNext}
            className={`px-8 py-3 rounded-xl font-bold text-white shadow-md transition-transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto bg-green-600 hover:bg-green-700`}
          >
            Next Problem
          </button>
        )}
      </div>
    </div>
  );
};
