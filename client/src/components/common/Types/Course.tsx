export type Course = {
  id: string;
  name: string;
  annotation: string;
  guarantor: string;
};

export type Activity = {
  id: number;
  type: string;
  recurrence: string;
  capacity: number;
  duration: string;
  lecturers: string[];
};

export type Instance = {
  id: number;
  course: string;
  type: string;
  room: string;
  lecturer: string;
  recurrence: string;
  day: string;
  start_time: string;
  duration: string;
  capacity: number;
};

export type Guarantor = {
  id: string;
};
