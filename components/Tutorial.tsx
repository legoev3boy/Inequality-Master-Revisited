
import React from 'react';
import { BookOpen, ArrowLeft } from 'lucide-react';

interface TutorialProps {
  onBack: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
        <div className="bg-indigo-600 p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <BookOpen size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Mastering Inequalities</h1>
          </div>
          <p className="text-indigo-100 text-lg max-w-2xl">
            Learn how to translate real-world problems into math language and solve them like a pro.
          </p>
        </div>

        <div className="p-8 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">1</div>
              Identify the Variable
            </h2>
            <div className="prose text-gray-600 leading-relaxed max-w-none">
              <p className="mb-4">
                Every word problem has an <strong>unknown</strong> quantity. This is your variable.
                Look for questions like "How many...", "What is the maximum...", or "Find the number of...".
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="font-medium text-blue-900">
                  <span className="font-bold">Example:</span> "Sal needs to make 7-letter words to break the record."
                  <br/>
                  <span className="text-blue-700 mt-1 block">Variable <strong>w</strong> = number of words Sal makes.</span>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">2</div>
              Translate Keywords
            </h2>
            <p className="text-gray-600 mb-6">
              Certain phrases give you clues about which inequality symbol to use.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-700">Greater Than (&gt;)</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• "More than"</li>
                  <li>• "Exceeds"</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-700">Less Than (&lt;)</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• "Fewer than"</li>
                  <li>• "Under"</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-700">At Least (≥)</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• "Minimum of"</li>
                  <li>• "No less than"</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-700">At Most (≤)</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• "Maximum of"</li>
                  <li>• "No more than"</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg text-purple-600">3</div>
              Flip the Sign!
            </h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-red-900 font-medium">
                <span className="font-bold">Important:</span> When you multiply or divide by a <span className="underline">negative</span> number, you MUST flip the inequality sign!
                <br/>
                <span className="text-red-700 mt-1 block font-mono">-2x &lt; 10 becomes x &gt; -5</span>
              </p>
            </div>
          </section>
        </div>
        
        <div className="bg-gray-50 p-8 text-center border-t border-gray-200">
          <button 
            onClick={onBack}
            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
          >
            Start Practice
          </button>
        </div>
      </div>
    </div>
  );
};
