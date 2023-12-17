// @author Tomáš Vlach
// @author Jan Kapsa
// @author Petr Teichgrab

import { useState, useEffect } from "react";
import { Course } from "../../components/common/Types/Course";
import { useNavigate } from "react-router-dom";
import { useAuthHeader } from "react-auth-kit";
import { getCourses } from "../../components/axios/CourseAxios";
import "../../styles/style.css";

const MainCoursesListPage = () => {
  const navigate = useNavigate();
  const authHeader = useAuthHeader();

  const [, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getCourses(setLoading, setCourses, authHeader);
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.guarantor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="coursePageContentWrapper">
        <input
          type="text"
          placeholder="Vyhledat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchBar"
        />
        <div className="courseCardWrapper">
          {filteredCourses.map((course: Course) => (
            <div
              key={course.id}
              className="courseCard"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <span className="courseCardID">
                <b>{course.id}</b>
              </span>
              <span className="courseCardGuarantor">{course.guarantor}</span>
              <h2>{course.name}</h2>
              <i className="courseCardAnnotation">{course.annotation.slice(0, 100)}...</i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainCoursesListPage;
