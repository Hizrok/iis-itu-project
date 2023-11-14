import { useState, useEffect } from "react";

type Course = {
  course_id: string;
  course_name: string;
  course_annotation: string;
  course_guarantor_login: string;
};

const MainCoursesListPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  // let courses = "loading..."

  useEffect(() => {
    async function fetchCourses() {
      const response = await fetch("http://localhost:3000/courses");
      const courses_json = await response.json();

      setCourses(courses_json);
      console.log(courses_json);
    }

    fetchCourses();
  }, []);

  return (
    <ul>
      {courses.map((course) => {
        return (
          <li key={course.course_id}>
            {course.course_id}, {course.course_name}, {course.course_annotation}
            , {course.course_guarantor_login}
          </li>
        );
      })}
    </ul>
  );
};

export default MainCoursesListPage;
