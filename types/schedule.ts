
export type ScheduleTag = 'meeting' | 'event' | 'holiday';

export type ScheduleLocationType = 'online' | 'offline';

export interface Schedule {
  id: string;
  name: string;
  start: Date;
  end: Date;
  locationType: ScheduleLocationType;
  locationLabel: string;      // e.g. "Google Meet", "Office"
  locationUrl?: string;       // only for online
  tag: ScheduleTag;
  color: string;
  notes?: string;
  createdAt: Date;
}
export const isSchedulePast = (schedule: Schedule, now: Date = new Date()) =>
  schedule.end.getTime() < now.getTime();
