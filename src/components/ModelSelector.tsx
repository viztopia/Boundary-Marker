import React from 'react';

interface Props {
  families: string[];
  activeFamily: string;
  onChange: (family: string) => void;
}

export const ModelSelector: React.FC<Props> = ({ families, activeFamily, onChange }) => {
  return (
    <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto max-w-full sm:max-w-2xl overflow-x-auto flex gap-2 p-1.5 bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl scrollbar-hide">
        {families.map(family => (
            <button
                key={family}
                onClick={() => onChange(family)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border border-transparent ${
                    activeFamily === family
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
                {family}
            </button>
        ))}
      </div>
    </div>
  );
};
