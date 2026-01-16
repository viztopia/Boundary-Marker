import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import type { ArchiveEntry } from '../utils/parser';
import { Header } from './Header';
import { Timeline } from './Timeline';
import { ModelSelector } from './ModelSelector';
import { AboutModal } from './AboutModal';
import { DateNavigator } from './DateNavigator';

interface Props {
  data: ArchiveEntry[];
  allFamilies: string[];
}

export const TimelineApp: React.FC<Props> = ({ data, allFamilies }) => {
  const [activeQuestion, setActiveQuestion] = useState<'full' | 'summary'>('summary');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Initialize with a server-safe default
  const [activeFamily, setActiveFamily] = useState<string>(allFamilies[0] || 'Claude');
  
  // Track the visible date to maintain context when switching families (ref for internal logic)
  const visibleDateRef = React.useRef<string | null>(null);
  
  // Track visible date for UI updates (DateNavigator)
  const [activeDate, setActiveDate] = useState<string | null>(null);

  // Compute data specific to current family (for DateNavigator)
  const currentFamilyData = useMemo(() => {
    return data.filter(entry => 
        Object.values(entry.models).some(m => m.family === activeFamily)
    );
  }, [data, activeFamily]);

  // Once mounted, check localStorage and update if needed
  useEffect(() => {
    const saved = localStorage.getItem('boundary-active-family');
    if (saved && allFamilies.includes(saved) && saved !== activeFamily) {
        setActiveFamily(saved);
    }
  }, []); // Run only once on mount

  // Save to localStorage & Maintain Scroll Position
  useLayoutEffect(() => {
    if (activeFamily) {
        localStorage.setItem('boundary-active-family', activeFamily);
    }
    
    // Logic: Find best matching date to scroll to
    if (visibleDateRef.current) {
        const targetDate = visibleDateRef.current;
        
        // Priority 1: Exact Match
        let el = document.getElementById(`entry-${targetDate}`);
        
        // Priority 2: Closest Date
        if (!el) {
            // Get all currently rendered dates available in DOM
            const availableDates = Array.from(document.querySelectorAll('.timeline-card'))
                .map(node => node.getAttribute('data-date'))
                .filter(Boolean) as string[];

            if (availableDates.length > 0) {
                // Find closest by time difference
                const targetTime = new Date(targetDate).getTime();
                
                const closest = availableDates.reduce((prev, curr) => {
                    const prevDiff = Math.abs(new Date(prev).getTime() - targetTime);
                    const currDiff = Math.abs(new Date(curr).getTime() - targetTime);
                    return currDiff < prevDiff ? curr : prev;
                });
                
                el = document.getElementById(`entry-${closest}`);
                
                // Show toast notification
                setToastMessage(`Date ${targetDate} not found in ${activeFamily}. Jumped to closest: ${closest}`);
                setIsToastVisible(true);
                
                setTimeout(() => {
                    setIsToastVisible(false); // Trigger fade out
                    setTimeout(() => setToastMessage(null), 500); // Remove from DOM after animation
                }, 5000);
            }
        }

        // Execute Jump (To Start of Element)
        if (el) {
            // block: 'start' aligns the top of element to top of scroll container
            // We add a scroll-margin-top via CSS (scroll-mt-32) on the card to clear the header
            el.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    }
  }, [activeFamily, activeQuestion]);

  // Setup Observer to track currently visible date
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        // Find the first intersecting entry
        const visible = entries.find(e => e.isIntersecting);
        if (visible) {
            const date = visible.target.getAttribute('data-date');
            if (date) {
                visibleDateRef.current = date;
                setActiveDate(date);
            }
        }
    }, {
        rootMargin: '-20% 0px -60% 0px' // Focus on the top part of screen
    });

    const cards = document.querySelectorAll('.timeline-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [activeFamily, activeQuestion]); // Re-attach when list changes

  const handleMonthClick = (targetDate: string) => {
      // Optimistic update for instant visual feedback
      setActiveDate(targetDate);
      visibleDateRef.current = targetDate;

      const el = document.getElementById(`entry-${targetDate}`);
      if (el) {
        // Use 'auto' behavior for instant jump to avoid sluggish feeling
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
  };

  return (
    <div className="h-screen overflow-hidden bg-background text-text font-sans selection:bg-accent/30 flex flex-col relative">
        <Header 
            activeQuestion={activeQuestion} 
            onChange={setActiveQuestion} 
            onOpenAbout={() => setIsAboutOpen(true)}
        />
        
        <DateNavigator 
            data={currentFamilyData} 
            activeDate={activeDate}
            onSelect={handleMonthClick}
        />

        <div className="flex-1 overflow-hidden relative">
            <Timeline 
                entries={data} 
                activeFamily={activeFamily} 
                activeQuestion={activeQuestion} 
            />
        </div>
        
        <ModelSelector 
            families={allFamilies} 
            activeFamily={activeFamily} 
            onChange={setActiveFamily} 
        />

        <AboutModal 
            isOpen={isAboutOpen} 
            onClose={() => setIsAboutOpen(false)} 
        />

        {/* Floating Toast Notification */}
        {toastMessage && (
            <div 
                className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-surface/90 backdrop-blur-md border border-accent/20 rounded-lg shadow-lg text-xs font-mono text-accent ${
                    isToastVisible ? 'animate-fade-in' : 'animate-fade-out'
                }`}
            >
                {toastMessage}
            </div>
        )}
    </div>
  );
};
