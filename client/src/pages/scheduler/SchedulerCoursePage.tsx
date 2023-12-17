// @author Tomáš Vlach
// @author Jan Kapsa

import { useState, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";

import { CircularProgress } from "@mui/material";
import "./styles.css";

import CourseDetail from "./CourseDetail";
import { Course } from "../../components/common/Types/Course";
import { getCourses } from "../../components/axios/CourseAxios";
import { getGuarantors } from "../../components/axios/UserAxios";

const SchedulerCoursePage = () => {
  const authHeader = useAuthHeader();

  const [loading, setLoading] = useState(true);

  const [courses, setCourses] = useState<Course[]>([]);
  const [seleted, setSelected] = useState<string>("");
  const [index, setIndex] = useState(0);

  const [guarantors, setGuarantors] = useState<string[]>([]);


  const handleSelect = (id: string, i: number) => {
    setSelected(id);
    setIndex(i);
  };

  useEffect(() => {
    getCourses(setLoading, setCourses, authHeader);
    getGuarantors(setLoading, setGuarantors, authHeader);
  }, []);

  return (
    <div>
      <h2>Seznam předmětů</h2>
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
            courses.map((course: Course, i) => (
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
          guarantors={guarantors}
          setCourses={setCourses}
          setSelected={setSelected}
          index={index}
        />
      </div>
    </div>
  );
};

export default SchedulerCoursePage;
