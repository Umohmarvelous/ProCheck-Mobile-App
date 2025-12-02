// types/schedule.ts
export type ScheduleTag = "meeting" | "event" | "holiday";

export type ScheduleColor =
  | "#202e32"
  | "#85937a"
  | "#586c5c"
  | "#a9af90"
  | "#dfdcb9";

export interface Schedule {
  id: string;
  name: string;
  start: Date;
  end: Date;
  locationType: "online" | "offline";
  locationLabel: string;   // e.g. "Google Meet", "Office"
  locationLink?: string;   // optional URL for online
  tag: ScheduleTag;
  color: ScheduleColor;
  createdAt: Date;
}
