'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronDown, Info } from 'lucide-react';
import { AVAILABLE_SUBJECTS, DEFAULT_SUBJECTS } from '@/data/subjects';
import { cn } from '@/utils/cn';

export interface SubjectEntry {
  name: string;
  mark: string;
}

interface SubjectFormProps {
  subjects: SubjectEntry[];
  onChange: (subjects: SubjectEntry[]) => void;
}

export default function SubjectForm({ subjects, onChange }: SubjectFormProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const addSubject = () => {
    if (subjects.length >= 9) return;
    onChange([...subjects, { name: '', mark: '' }]);
  };

  const removeSubject = (index: number) => {
    if (subjects.length <= 4) return;
    onChange(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index: number, field: 'name' | 'mark', value: string) => {
    const updated = subjects.map((s, i) => i === index ? { ...s, [field]: value } : s);
    onChange(updated);
  };

  const usedNames = subjects.map(s => s.name).filter(Boolean);
  const availableFor = (index: number) =>
    AVAILABLE_SUBJECTS.filter(s => !usedNames.includes(s.name) || subjects[index].name === s.name);

  const getMarkColor = (mark: string) => {
    const n = Number(mark);
    if (!mark || isNaN(n)) return 'border-white/10';
    if (n >= 80) return 'border-[#CAFF00]/50 bg-[#CAFF00]/5';
    if (n >= 70) return 'border-green-400/50 bg-green-400/5';
    if (n >= 60) return 'border-emerald-400/40 bg-emerald-400/5';
    if (n >= 50) return 'border-yellow-400/40 bg-yellow-400/5';
    if (n >= 40) return 'border-orange-400/40 bg-orange-400/5';
    return 'border-red-400/40 bg-red-400/5';
  };

  const getMarkAPS = (mark: string) => {
    const n = Number(mark);
    if (!mark || isNaN(n)) return null;
    if (n >= 80) return 7;
    if (n >= 70) return 6;
    if (n >= 60) return 5;
    if (n >= 50) return 4;
    if (n >= 40) return 3;
    if (n >= 30) return 2;
    return 1;
  };

  // Group subjects
  const groups = ['Languages', 'Core', 'Sciences', 'Technology', 'Commerce', 'Humanities'] as const;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">Your Subjects</h3>
          <span
            data-tooltip="Add your Grade 12 NSC subjects and percentage marks. APS will be calculated automatically."
            className="cursor-help"
          >
            <Info size={13} className="text-[#555] hover:text-[#CAFF00] transition-colors" />
          </span>
        </div>
        <span className="text-xs text-[#555] font-mono">{subjects.length}/9 subjects</span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_100px_32px] gap-2 px-1">
        <span className="text-[10px] text-[#444] uppercase tracking-wider">Subject</span>
        <span className="text-[10px] text-[#444] uppercase tracking-wider text-center">Mark % → APS</span>
        <span></span>
      </div>

      <AnimatePresence initial={false}>
        {subjects.map((subject, index) => {
          const aps = getMarkAPS(subject.mark);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-[1fr_100px_32px] gap-2 items-center">
                {/* Subject selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                    className={cn(
                      'input-field text-left flex items-center justify-between',
                      !subject.name && 'text-[#444]'
                    )}
                  >
                    <span className="truncate text-sm">
                      {subject.name || 'Select subject…'}
                    </span>
                    <ChevronDown size={14} className={cn('flex-shrink-0 text-[#555] transition-transform', openDropdown === index && 'rotate-180')} />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {openDropdown === index && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                        style={{ maxHeight: 280, overflowY: 'auto' }}
                      >
                        {groups.map(group => {
                          const groupSubjects = availableFor(index).filter(s => s.group === group);
                          if (!groupSubjects.length) return null;
                          return (
                            <div key={group}>
                              <div className="px-3 py-1.5 text-[10px] text-[#444] uppercase tracking-wider bg-white/2 sticky top-0">
                                {group}
                              </div>
                              {groupSubjects.map(s => (
                                <button
                                  key={s.name}
                                  type="button"
                                  onClick={() => {
                                    updateSubject(index, 'name', s.name);
                                    setOpenDropdown(null);
                                  }}
                                  className={cn(
                                    'w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors',
                                    subject.name === s.name ? 'text-[#CAFF00] bg-[#CAFF00]/5' : 'text-[#bbb]'
                                  )}
                                >
                                  {s.name}
                                </button>
                              ))}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mark input with APS indicator */}
                <div className="relative flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={subject.mark}
                    onChange={e => updateSubject(index, 'mark', e.target.value)}
                    placeholder="0–100"
                    className={cn(
                      'input-field text-center w-14 flex-shrink-0 transition-all',
                      getMarkColor(subject.mark)
                    )}
                  />
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono flex-shrink-0',
                    aps !== null
                      ? 'bg-white/5 text-[#CAFF00]'
                      : 'bg-white/3 text-[#333]'
                  )}>
                    {aps ?? '–'}
                  </div>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeSubject(index)}
                  disabled={subjects.length <= 4}
                  className="p-1.5 rounded-lg text-[#444] hover:text-red-400 hover:bg-red-500/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Add button */}
      {subjects.length < 9 && (
        <motion.button
          type="button"
          onClick={addSubject}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/10 hover:border-[#CAFF00]/30 text-[#555] hover:text-[#CAFF00] text-sm transition-all hover:bg-[#CAFF00]/3"
        >
          <Plus size={15} />
          Add subject
        </motion.button>
      )}
    </div>
  );
}
