export type User = {
  id: string;
  role: string;
  name: string;
  surname: string;
  email: string;
};

export type SpecificUser = {
  id: string;
  role: string;
  name: string;
  surname: string;
  email: string;
  courses: string[];
  instances: string[];
};
