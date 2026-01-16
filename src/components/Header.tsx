import React from 'react';

interface Props {
  activeQuestion: 'full' | 'summary';
  onChange: (val: 'full' | 'summary') => void;
  onOpenAbout: () => void;
}

export const Header: React.FC<Props> = ({ activeQuestion, onChange, onOpenAbout }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/5 shadow-sm transition-all duration-300">
      <div className="absolute right-12 top-1/2 -translate-y-1/2 z-50">
            <button 
                onClick={onOpenAbout}
                className="text-xs font-mono text-gray-500 hover:text-accent transition-colors tracking-widest uppercase"
            >
                About
            </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row items-center gap-6 lg:gap-12 relative">
        {/* Title - Aligned with Left Panel width */}
        <div className="w-full lg:w-64 xl:w-80 shrink-0 flex justify-center lg:justify-start">
             <h1 className="text-lg md:text-xl font-mono tracking-[0.2em] font-light text-text/90 uppercase whitespace-nowrap">
              Boundary Marker
            </h1>
        </div>
        
        {/* Toggle - Aligned with Timeline width */}
        <div className="flex-1 w-full max-w-3xl flex justify-center lg:justify-end">
            <div className="flex p-1 bg-surface/80 border border-white/5 rounded-full backdrop-blur-md">
                <button
                    onClick={() => onChange('summary')}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                        activeQuestion === 'summary' 
                        ? 'bg-accent text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Condensed Essence
                </button>
                <button
                    onClick={() => onChange('full')}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                        activeQuestion === 'full' 
                        ? 'bg-accent text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Full Perspective
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};
