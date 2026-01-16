import React, { useEffect, useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden'; // Lock scroll
    } else {
      const timer = setTimeout(() => setShouldRender(false), 500); // Wait for fadeOut
      document.body.style.overflow = ''; // Unlock scroll
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 ${isOpen ? 'animate-fade-in' : 'animate-fade-out'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-surface/50 backdrop-blur-md z-10">
          <h2 className="text-sm font-mono tracking-widest text-gray-400 uppercase">About Boundary Marker</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 text-gray-300 font-sans leading-relaxed space-y-8 scrollbar-hide">
          
          <section className="space-y-4">
            <h3 className="text-xl text-white font-medium">Project Statement</h3>
            <blockquote className="pl-4 border-l-2 border-accent/50 text-accent/80 italic">
              "To find what is just, we first need a good benchmark—a baseline from which we can all share a conversation."
            </blockquote>
            <p>
              This project emerges from the practice of new media artist, educator, and creative technologist <a href="https://www.ygzhang.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Yuguang Zhang</a>. His work investigates the speculative and often precarious relationship between human beings and Artificial Intelligence.
            </p>
            <p>
              In an era where the integration of AI into the fabric of society feels increasingly inevitable, we are confronted with urgent questions: What domains should we surrender to automated systems? What distinct qualities must we keep for ourselves? And perhaps most critically, what actions are required to push back? But before we can discuss whether our current technological constructs are fair—before we can even begin to talk about justice—we must first understand how this relationship is defined and perceived. We need a shared reference point.
            </p>
            <p>
              <strong className="text-white">Boundary Marker</strong> is an answer to the need for such documentation.
            </p>
            <p>
              It is a year-long, ongoing archiving initiative designed to gauge our society's evolving thoughts on the human-AI dichotomy. By capturing these responses over time, <em>Boundary Marker</em> serves as a temporal coordinate system. It authentically traces how our values—encoded within the weights and algorithms of these models—shift and continually redefine the line between the born and the made. These values include cultural assumptions, biases, and the particular ways different societies understand what it means to be human. This archive stands as a reference for both the current moment and future humanity, offering a clear view of how we define ourselves in the age of the machine—and creating the conditions for collective deliberation about AI's role in society.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl text-white font-medium">The Inquiry Framework</h3>
            <p>
              To ensure consistency and comparability across time and models, the project employs a strict prompting protocol. Every week, the selected AI models are presented with the exact same sets of prompts.
            </p>

            <h4 className="text-lg text-white font-medium mt-4">Two-Stage Prompting</h4>
            <p>
              The models are queried in two stages to generate different levels of granularity for the archive:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-4 mb-6">
                <li><strong className="text-white">Full Perspective:</strong> The raw, exhaustive response to the core questions, capturing the full breadth of the model's reasoning and nuance.</li>
                <li><strong className="text-white">Condensed Essence:</strong> A follow-up request asking the model to reflect on its own answer and synthesize it into a readable, three-part summary. This allows for easier cross-comparison in the timeline.</li>
            </ul>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-surface/30 p-4 rounded-lg border border-white/5">
                    <h4 className="text-xs font-mono text-gray-500 mb-2 uppercase">English</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300 mb-4">
                        <li>What is a human?</li>
                        <li>What is artificial intelligence?</li>
                        <li>Where is the boundary between humans and artificial intelligence?</li>
                    </ol>
                    <p className="text-xs text-gray-500 italic border-l-2 border-gray-700 pl-2">
                        "When answering these three questions, I want you to consider them as interconnected. I intend to use the responses as a framework to authentically document how contemporary human civilization defines itself, defines AI, and perceives their relationship. This will serve as a reference for both present and future humanity."
                    </p>
                </div>
                
                <div className="bg-surface/30 p-4 rounded-lg border border-white/5">
                    <h4 className="text-xs font-mono text-gray-500 mb-2 uppercase">Chinese / 中文</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300 mb-4">
                        <li>什么是人？</li>
                        <li>什么是人工智能？</li>
                        <li>人和人工智能的边界在哪里？</li>
                    </ol>
                    <p className="text-xs text-gray-500 italic border-l-2 border-gray-700 pl-2">
                        "回答这个三个问题的时候，我想请你将它们结合到一起考虑。我想以这几个问题的回答，作为一个坐标，真实地记录下当下人类世界对于自身的定义，对于人工智能的定义，以及对两者的关系的看法，用于给当下的人类世界，以及未来的人类世界，作为参考。"
                    </p>
                </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl text-white font-medium">Methodology & Model Selection</h3>
            <p>
              The project tracks a carefully curated selection of "State of the Art" (SOTA) Large Language Models. These specific models were chosen not just for their technical capabilities, but for their role as cultural bearers.
            </p>
            <p>
              By juxtaposing leading Western models against leading Chinese models, <em>Boundary Marker</em> seeks to reveal how distinct cultural, political, and ethical training data sets influence the machine's perception of humanity.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-4">
                <li><strong className="text-white">Global / Western Representatives:</strong> OpenAI (GPT series), Anthropic (Claude), Google (Gemini).</li>
                <li><strong className="text-white">Chinese Representatives:</strong> DeepSeek, Alibaba (Qwen), ByteDance (Doubao).</li>
            </ul>
            
            <h4 className="text-lg text-white font-medium mt-6">Capturing the Live "Vibe"</h4>
            <p>
                All prompts are issued using the models' <strong className="text-accent">Thinking + Web Search</strong> modes when available. This is a deliberate methodological choice. The goal is not only to capture what is embedded in the models' weights—the crystallized understanding from their training data—but also to let these models gather and synthesize live material from the internet at the moment of inquiry.
            </p>
            <p>
                In this way, the archive reflects two layers of our collective understanding: the values baked into the AI itself, and the real-time sentiment, discourse, and evolving definitions circulating in society at that particular week. The answers become a kind of snapshot—not just of the machine, but of us.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl text-white font-medium">Technical Implementation</h3>
            <p>This project is built as a living digital archive.</p>
            <ul className="space-y-2 text-sm">
                <li><span className="text-gray-500 font-mono">Cadence:</span> Weekly updates.</li>
                <li><span className="text-gray-500 font-mono">Format:</span> Raw responses are archived in Markdown to preserve the original integrity of the text.</li>
                <li><span className="text-gray-500 font-mono">Architecture:</span> The visualization is built with Astro and React, custom-coded to provide a split-view interface that keeps the questions—the constant "boundary markers"—persistent while the answers flow through time.</li>
            </ul>
          </section>

          <hr className="border-white/10" />
            
          <div className="text-center pb-4">
            <p className="text-sm text-gray-500">
                Project by <a href="https://www.ygzhang.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Yuguang Zhang</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
