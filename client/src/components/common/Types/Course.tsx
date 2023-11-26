import User from "./User";

type Course = {
    id: string;
    name: string;
    annotation: string;
    guarantor: User;
};
export default Course;