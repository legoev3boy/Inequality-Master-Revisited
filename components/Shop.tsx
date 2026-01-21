
import React from 'react';
import { Character } from '../types';
import { ArrowLeft, ShoppingBag, Palette, Smile, Save, Sparkles } from 'lucide-react';

interface ShopProps {
  points: number;
  character: Character;
  onUpdateCharacter: (newChar: Character) => void;
  onBack: () => void;
  onSpendPoints: (amount: number) => void;
}

const AVATARS = ['🎓', '🦁', '🚀', '🧙‍♂️', '🤖', '👾', '🦊', '🦄', '🐲', '🌈'];
const COLORS = [
  { name: 'Indigo', value: 'bg-indigo-500' },
  { name: 'Emerald', value: 'bg-emerald-500' },
  { name: 'Rose', value: 'bg-rose-500' },
  { name: 'Amber', value: 'bg-amber-500' },
  { name: 'Violet', value: 'bg-violet-500' },
  { name: 'Cyan', value: 'bg-cyan-500' },
];

export const Shop: React.FC<ShopProps> = ({ points, character, onUpdateCharacter, onBack, onSpendPoints }) => {
  const [tempName, setTempName] = React.useState(character.name);
  const ITEM_COST = 50;

  const handleBuyItem = (type: 'avatar' | 'color', value: string) => {
    if (character.unlockedItems.includes(value)) {
      onUpdateCharacter({ ...character, [type]: value, name: tempName });
      return;
    }

    if (points >= ITEM_COST) {
      onSpendPoints(ITEM_COST);
      onUpdateCharacter({
        ...character,
        [type]: value,
        name: tempName,
        unlockedItems: [...character.unlockedItems, value]
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="mb-6 flex items-center text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
        <ArrowLeft className="mr-2" size={20} /> Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center mb-8">
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl shadow-xl mb-4 ${character.color}`}>
              {character.avatar}
            </div>
            <input 
              type="text" 
              value={tempName} 
              onChange={(e) => setTempName(e.target.value)}
              className="text-2xl font-black text-gray-900 bg-transparent border-b-2 border-dashed border-gray-200 focus:border-indigo-500 outline-none text-center w-full"
              placeholder="Your Name"
            />
            <p className="mt-4 flex items-center justify-center gap-2 font-bold text-amber-600 bg-amber-50 py-2 px-4 rounded-full mx-auto w-fit">
              <Sparkles size={18} /> {points} Points Available
            </p>
          </div>

          <button 
            onClick={() => onUpdateCharacter({ ...character, name: tempName })}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
          >
            <Save size={20} /> Save Character
          </button>
        </div>

        <div className="flex-[2] space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6">
            <h3 className="flex items-center gap-2 font-black text-gray-400 uppercase tracking-widest text-xs mb-4">
              <Smile size={16} /> Choose Avatar (50 pts each)
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {AVATARS.map(icon => (
                <button
                  key={icon}
                  onClick={() => handleBuyItem('avatar', icon)}
                  className={`aspect-square text-3xl flex items-center justify-center rounded-2xl transition-all border-2 ${
                    character.avatar === icon ? 'border-indigo-500 bg-indigo-50 shadow-inner' : 
                    character.unlockedItems.includes(icon) ? 'border-gray-100 bg-gray-50' : 'border-dashed border-gray-200 opacity-60'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6">
            <h3 className="flex items-center gap-2 font-black text-gray-400 uppercase tracking-widest text-xs mb-4">
              <Palette size={16} /> Background Color (50 pts each)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => handleBuyItem('color', c.value)}
                  className={`p-4 rounded-2xl flex items-center gap-3 transition-all border-2 ${
                    character.color === c.value ? 'border-indigo-500 shadow-inner' : 
                    character.unlockedItems.includes(c.value) ? 'border-gray-100' : 'border-dashed border-gray-200 opacity-60'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${c.value}`} />
                  <span className="text-xs font-bold text-gray-600">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
