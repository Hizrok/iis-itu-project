import { useState, useEffect } from "react";
import { useAuthHeader, useAuthUser } from "react-auth-kit";

import { CircularProgress } from "@mui/material";
import "./styles.css"

import CourseDetail from "./CourseDetail";
import { Course } from "../../components/common/Types/Course";
import { deleteCourse, editCourseNoGuarantor, getCourses } from "../../components/axios/CourseAxios";

const GuarantiedCourseList = () => {
  const authHeader = useAuthHeader();
  const auth = useAuthUser();

  const [loading, setLoading] = useState(true);

  const [courses, setCourses] = useState<Course[]>([]);
  const [displayCourses, setDisplayCourses] = useState<Course[]>([]);
  const [seleted, setSelected] = useState<string>("");
  const [index, setIndex] = useState(0);

  const resetSelected = () => {
    setSelected("");
    setIndex(0);
    setCourses(courses.filter((course: Course) => course.id !== seleted));
  }

  const result = courses.filter((obj) => {
    return obj.guarantor === auth()?.id;
  });
  
  const handleSelect = (id: string, i: number) => {
    setSelected(id);
    setIndex(i);
  };

  useEffect(() => {
    getCourses(setLoading, setCourses, authHeader);
  }, []);

  useEffect(() => {
    setDisplayCourses(result);
  }, [courses]);

  return (
    <div>
      <h2>Seznam garantovaných předmětů</h2>
      <div className="list-page-content">
        <div className="list">
          <div className="list-header course-list">
            <span>id</span>
            <span>name</span>
            <span>guarantor</span>
          </div>

          {loading ? (
            <div className="loader-container">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            displayCourses.map((course: Course, i) => (
              <div
                className={`list-item course-list ${
                  course.id === seleted && "list-item-selected"
                }`}
                key={i}
                onClick={() => handleSelect(course.id, i)}
              >
                <span>{course.id}</span>
                <span>{course.name}</span>
                <span>{course.guarantor}</span>
              </div>
            ))
          )}
        </div>
        <CourseDetail
            id={seleted}
            editCourse={editCourseNoGuarantor}
            deleteCourse={deleteCourse}
            resetSelected={resetSelected}
            setCourses={setDisplayCourses}
            setSelected={setSelected}
            index={index} 
            />
      </div>
    </div>
  );
};

export default GuarantiedCourseList;
