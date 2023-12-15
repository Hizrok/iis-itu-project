import { useState, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";

import { Button, CircularProgress } from "@mui/material";
import "../styles.css";

import CourseDetail from "./CourseDetail";
import CreateCourseDialog from "./CreateCourseDialog";
import { Course } from "../../../components/common/Types/Course";
import { createCourse, deleteCourse, editCourse, getCourses } from "../../../components/axios/CourseAxios";
import { getGuarantors } from "../../../components/axios/UserAxios";

const CourseListPage = () => {
  const authHeader = useAuthHeader();

  const [loading, setLoading] = useState(true);

  const [courses, setCourses] = useState<Course[]>([]);
  const [seleted, setSelected] = useState<string>("");
  const [index, setIndex] = useState(0);

  const [guarantors, setGuarantors] = useState<string[]>([]);

  const [showDialog, setShowDialog] = useState(false);

  const resetSelected = () => {
    setSelected("");
    setIndex(0);
    setCourses(courses.filter((course: Course) => course.id !== seleted));
  }

  const toggleDialog = (value: boolean) => {
    setShowDialog(value);
  };

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
      <Button variant="contained" onClick={() => toggleDialog(true)}>
        create course
      </Button>
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
          editCourse={editCourse}
          deleteCourse={deleteCourse}
          resetSelected={resetSelected}
          setCourses={setCourses}
          setSelected={setSelected}
          index={index}
        />
      </div>
      <CreateCourseDialog
        showDialog={showDialog}
        guarantors={guarantors}
        toggleDialog={toggleDialog}
        createCourse={createCourse}
        setCourses={setCourses}
      />
    </div>
  );
};

export default CourseListPage;
