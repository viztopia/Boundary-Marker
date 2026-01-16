import React, { useMemo } from 'react';
import type { ArchiveEntry } from '../utils/parser';

interface Props {
  data: ArchiveEntry[];
  activeDate: string | null;
  onSelect: (date: string) => void;
}

interface MonthGroup {
  name: string;      // "Jan", "Feb"
  value: string;     // "01", "02"
  latestDate: string; // The specific YYYY-MM-DD to jump to
}

interface YearGroup {
  year: string;
  months: MonthGroup[];
}

function groupEntriesByDate(entries: ArchiveEntry[]): YearGroup[] {
  const groups: Record<string, Record<string, string>> = {};

  entries.forEach(entry => {
    const [year, month] = entry.date.split('-');
    if (!groups[year]) groups[year] = {};
    
    // Since entries are sorted desc, the first time we see a month, 
    // it corresponds to the LATEST entry for that month
    if (!groups[year][month]) {
      groups[year][month] = entry.date;
    }
  });

  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a)) // Sort Years Desc
    .map(year => ({
      year,
      months: Object.keys(groups[year])
        .sort((a, b) => b.localeCompare(a)) // Sort Months Desc
        .map(month => ({
          name: new Date(2000, parseInt(month) - 1).toLocaleString('default', { month: 'short' }),
          value: month,
          latestDate: groups[year][month]
        }))
    }));
}

export const DateNavigator: React.FC<Props> = ({ data, activeDate, onSelect }) => {
  const groups = useMemo(() => groupEntriesByDate(data), [data]);
  const activeMonth = activeDate ? activeDate.substring(0, 7) : ''; // YYYY-MM

  if (groups.length === 0) return null;

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-6 z-40">
      {groups.map(g => (
        <div key={g.year} className="flex flex-col items-end gap-2">
           <span className="text-[10px] font-mono font-bold text-white/10 select-none">
             {g.year}
           </span>
           <div className="flex flex-col gap-1 items-end border-r border-white/5 pr-4">
             {g.months.map(m => {
               const isActive = activeMonth === `${g.year}-${m.value}`;
               return (
                 <button
                   key={m.value}
                   onClick={() => onSelect(m.latestDate)}
                   className={`text-xs font-mono transition-colors duration-300 ${
                     isActive ? 'text-accent font-bold' : 'text-gray-600 hover:text-gray-400'
                   }`}
                 >
                   {m.name}
                 </button>
               )
             })}
           </div>
        </div>
      ))}
    </nav>
  );
};
