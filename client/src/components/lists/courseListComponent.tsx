import { useNavigate } from "react-router-dom";
import Course from "../../components/common/Types/Course";

export interface CourseListProps {
    courses: Course[];
};

const CourseList = (props: CourseListProps) => {
  
  const navigate = useNavigate();
  
  function handleCourseClick(id: string): void {
    navigate(`/course_details/${id}`);
  }

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
              onClick={() => handleCourseClick(course.id)}
            >
                <span className="list-item-property">{course.id}</span>
                <span className="list-item-property">{course.name}</span>
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