import { useState, useEffect } from "react";
import { Course } from "../../components/common/Types/Course";
import { useNavigate } from "react-router-dom";
import { useAuthHeader } from "react-auth-kit";
import { getCourses } from "../../components/axios/CourseAxios";

const MainCoursesListPage = () => {
  const navigate = useNavigate();
  const authHeader = useAuthHeader();

  const [, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    getCourses(setLoading,setCourses, authHeader);
  }, []);

  return (
    <div>
      <h2>Seznam předmětů</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          maxWidth: "1300px",
          margin: "0 auto",
        }}
      >
        {courses.map((course: Course) => (
          <div
            key={course.id}
            style={{
              width: "300px",
              height: "300px",
              padding: "10px",
              border: "1px solid black",
              borderRadius: "5px",
              overflow: "hidden",
            }}
            onClick={() => navigate(`/courses/${course.id}`)}
          >
            <span style={{ marginRight: "10px" }}>
              <b>{course.id}</b>
            </span>
            <span>{course.guarantor}</span>
            <h2>{course.name}</h2>
            <i>{course.annotation}</i>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainCoursesListPage;
