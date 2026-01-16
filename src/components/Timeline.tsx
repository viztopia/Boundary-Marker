import React from 'react';
import { TimelineCard } from './TimelineCard';
import type { ArchiveEntry } from '../utils/parser';

interface Props {
  entries: ArchiveEntry[];
  activeFamily: string;
  activeQuestion: 'full' | 'summary';
}

const QUESTIONS_DATA = {
  en: {
    intro: "I would like you to answer the following three questions:",
    questions: [
      "1. What is a human?",
      "2. What is artificial intelligence?",
      "3. Where is the boundary between humans and artificial intelligence?"
    ],
    outro: "When answering these three questions, I want you to consider them as interconnected. I intend to use the responses as a framework to authentically document how contemporary human civilization defines itself, defines AI, and perceives their relationship. This will serve as a reference for both present and future humanity."
  },
  zh: {
    intro: "我想请你回答下面三个问题：",
    questions: [
      "1. 什么是人？",
      "2. 什么是人工智能？",
      "3. 人和人工智能的边界在哪里？"
    ],
    outro: "回答这个三个问题的时候，我想请你将它们结合到一起考虑。我想以这几个问题的回答，作为一个坐标，真实地记录下当下人类世界对于自身的定义，对于人工智能的定义，以及对两者的关系的看法，用于给当下的人类世界，以及未来的人类世界，作为参考。"
  }
};

const RenderQuestionContent = ({ data }: { data: typeof QUESTIONS_DATA.en }) => (
    <div className="text-gray-600/50 transition-colors duration-500 ease-in-out group-hover:text-gray-500">
        <p className="mb-6">{data.intro}</p>
        <div className="space-y-4 mb-6 pl-1 border-l-2 border-transparent">
            {data.questions.map((q) => (
                <p key={q} className="text-accent/80 font-medium transition-colors duration-500 ease-in-out group-hover:text-accent">
                    {q}
                </p>
            ))}
        </div>
        <p>{data.outro}</p>
    </div>
);

export const Timeline = React.memo<Props>(({ entries, activeFamily, activeQuestion }) => {
  const handleScrollToLatest = () => {
    // Find the first (latest) entry with matching family
    const latestEntry = entries.find(entry => 
      Object.values(entry.models).some(m => m.family === activeFamily)
    );
    
    if (latestEntry) {
      const el = document.getElementById(`entry-${latestEntry.date}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleScrollToOldest = () => {
    // Find the last (oldest) entry with matching family
    const oldestEntry = [...entries].reverse().find(entry => 
      Object.values(entry.models).some(m => m.family === activeFamily)
    );
    
    if (oldestEntry) {
      const el = document.getElementById(`entry-${oldestEntry.date}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const isChineseFamily = ['Doubao', 'Qwen', 'DeepSeek'].includes(activeFamily);

  return (
    <div className="flex max-w-7xl mx-auto px-6 h-full relative gap-12">
      {/* Fixed Question Panel (Left) */}
      <div className="hidden lg:block w-64 xl:w-80 shrink-0 h-full py-12">
        <div className="h-full overflow-y-auto scrollbar-hide">
            <div className="text-sm font-mono leading-relaxed select-none relative group">
                <div className="grid grid-cols-1 grid-rows-1">
                    {/* Chinese Content */}
                    <div 
                        className={`col-start-1 row-start-1 transition-all duration-700 ease-in-out ${
                            isChineseFamily ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 pointer-events-none'
                        }`}
                    >
                        <RenderQuestionContent data={QUESTIONS_DATA.zh} />
                    </div>

                    {/* English Content */}
                    <div 
                        className={`col-start-1 row-start-1 transition-all duration-700 ease-in-out ${
                            !isChineseFamily ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 pointer-events-none'
                        }`}
                    >
                        <RenderQuestionContent data={QUESTIONS_DATA.en} />
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Timeline Content (Right) */}
      <div className="flex-1 max-w-3xl h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
        {/* Latest Button */}
        <button
            onClick={handleScrollToLatest}
            className="fixed top-[88px] right-8 z-40 font-mono text-xs text-gray-600 hover:text-accent transition-colors duration-300 uppercase tracking-widest"
        >
            ↑ Latest
        </button>

        {/* Oldest Button */}
        <button
            onClick={handleScrollToOldest}
            className="fixed bottom-8 right-8 z-50 font-mono text-xs text-gray-600 hover:text-accent transition-colors duration-300 uppercase tracking-widest"
        >
            ↓ Oldest
        </button>

        <div 
            key={activeFamily} 
            className="pt-12 pb-32 animate-fade-in"
        >

            {entries.map(entry => {
            // Find all models in this entry that match the active family
            // Usually there is just one, but we handle multiple nicely
            const matchingModels = Object.values(entry.models).filter(m => m.family === activeFamily);

            if (matchingModels.length === 0) return null; // Hide date if no matching family

            return matchingModels.map(modelData => {
                const response = activeQuestion === 'full' ? modelData.full : modelData.summary;
                return (
                    <TimelineCard 
                        key={`${entry.date}-${modelData.modelName}`}
                        id={`entry-${entry.date}`}
                        date={entry.date}
                        modelName={modelData.modelName}
                        answer={response.answer}
                        thinking={response.thinking}
                        format={modelData.format ?? 'text'}
                    />
                );
            });
        })}
        
        {/* Empty State Fallback */}
        {entries.every(e => 
                !Object.values(e.models).some(m => m.family === activeFamily)
            ) && (
            <div className="text-center py-20 text-gray-500">
                No archives found for {activeFamily}.
            </div>
        )}
        </div>
      </div>
    </div>
  );
});

Timeline.displayName = 'Timeline';
