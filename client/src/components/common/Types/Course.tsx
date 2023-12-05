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
};

export type Guarantor = {
  id: string;
};
