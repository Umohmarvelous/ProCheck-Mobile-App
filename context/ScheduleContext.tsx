// context/ScheduleContext.tsx
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Schedule } from '../types/schedule';

interface ScheduleContextValue {
  schedules: Schedule[];
  addSchedule: (s: Schedule) => void;
  deleteSchedule: (id: string) => void;
}

const ScheduleContext = createContext<ScheduleContextValue | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const addSchedule = useCallback((schedule: Schedule) => {
    setSchedules(prev => [...prev, schedule]);
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  }, []);

  const value = useMemo(
    () => ({ schedules, addSchedule, deleteSchedule }),
    [schedules, addSchedule, deleteSchedule]
  );

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
};

export const useSchedules = () => {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error('useSchedules must be inside ScheduleProvider');
  return ctx;
};
