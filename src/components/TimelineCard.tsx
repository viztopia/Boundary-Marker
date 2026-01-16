import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  date: string;
  modelName: string;
  answer: string;
  thinking?: string;
  id?: string;
  format?: 'markdown' | 'text';
}

export const TimelineCard: React.FC<Props> = ({ date, modelName, answer, thinking, id, format = 'text' }) => {
  const [isThinkingOpen, setIsThinkingOpen] = useState(false);

  return (
    <div 
        id={id}
        data-date={date}
        className="timeline-card mb-12 border-l-2 border-surface pl-6 relative scroll-mt-0"
    >
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-surface border-4 border-background"></div>
      
      {/* Sticky Header for Context while scrolling 
          - Taller vertical padding (py-3 -> py-4) to cover gaps
          - Negative top margin (-mt-2) to pull it up into the seam
      */}
      <div className="sticky top-0 z-30 bg-background py-4 -mt-2 -ml-2 pl-2 border-b border-surface/20 shadow-[0_10px_10px_-5px_rgba(22,22,23,0.5)]">
        <div className="flex flex-wrap items-baseline gap-3">
            <time className="block text-sm text-accent font-mono">{date}</time>
            <span className="text-xs text-gray-400 font-mono tracking-wide px-2 py-0.5 rounded-full bg-surface border border-white/5">
                {modelName}
            </span>
        </div>
      </div>
      
      {thinking && (
        <div className="mb-4">
            <button 
                onClick={() => setIsThinkingOpen(!isThinkingOpen)}
                className="text-xs font-mono text-gray-500 hover:text-accent flex items-center gap-2 transition-colors cursor-pointer"
            >
                {isThinkingOpen ? '▼ Hide Thinking Process' : '▶ View Thinking Process'}
            </button>
            
            {isThinkingOpen && (
                <div className="mt-2 p-4 bg-surface/50 rounded-lg text-sm text-gray-400 font-mono whitespace-pre-wrap break-words leading-relaxed border border-white/5">
                    {thinking}
                </div>
            )}
        </div>
      )}

      <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white max-w-none">
        {format === 'markdown' ? (
            // Wrapper div used for styling instead of passing className to ReactMarkdown
            <div className="markdown-content leading-7 font-light text-lg space-y-4">
                <ReactMarkdown 
                    components={{
                        p: ({node, ...props}) => <p className="mb-4 text-gray-300" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 my-4 space-y-2 text-gray-300" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-4 space-y-2 text-gray-300" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-8 mb-4 text-white" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-3 text-white" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-white" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-500 pl-4 py-1 italic my-4 text-gray-400" {...props} />,
                    code: ({node, ...props}) => <code className="bg-gray-800 rounded px-1 py-0.5 text-sm font-mono text-gray-200" {...props} />,
                    pre: ({node, ...props}) => <pre className="bg-gray-800 rounded p-4 overflow-x-auto my-4 text-sm font-mono text-gray-200" {...props} />,
                    }}
                >
                    {answer}
                </ReactMarkdown>
            </div>
        ) : (
            <div className="whitespace-pre-wrap break-words leading-7 font-light text-lg text-gray-300">
                {answer}
            </div>
        )}
      </div>
    </div>
  );
};
