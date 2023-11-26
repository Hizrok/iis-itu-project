import Activity from "./Activity";
import User from "./User";

type Course = {
    id: string;
    name: string;
    annotation: string;
    guarantor: User;
    activities?: Activity[];
};
export default Course;