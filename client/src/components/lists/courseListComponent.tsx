import { Link } from "react-router-dom";

type User = {
    id: string;
    role: string;
    name: string;
    surname: string;
}

type Course = {
    id: string;
    name: string;
    annotation: string;
    guarantor: User;
};

export interface CourseListProps {
    courses: Course[];
};

const CourseList = (props: CourseListProps) => {
  return (
    <div className="course-page">
      <div className="list-pages-list-container">
        <h2>Seznam Předmětů</h2>
        <ul>
            <li className="list-header"
            key="header">
            <span className="header-item">ID</span>
            <span className="header-item">Název předmětu</span>
            <span className="header-item">Garant Předmětu</span>
            <span className="header-item">Anotace Předmětu</span>
            </li>
            {props.courses.map((course: Course) => (
            <li
                key={course.id}
                className="list-item-properties"
            >
                <span className="list-item-property">{course.id}</span>
                <span className="list-item-property"><Link to={`/course_details/${course.id}`}>{course.name}</Link></span>
                <span className="list-item-property">{course.guarantor.id}</span>
                <span className="list-item-property">{course.annotation.substring(0, 15)}...</span>
            </li>
        ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseList;
