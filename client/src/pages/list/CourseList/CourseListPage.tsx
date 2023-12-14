import { useState, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import { useConfirm } from "material-ui-confirm";
import axios from "axios";

import { Button, CircularProgress } from "@mui/material";
import "../styles.css";

import CourseDetail from "./CourseDetail";
import CreateCourseDialog from "./CreateCourseDialog";
import { Course, Guarantor } from "../../../components/common/Types/Course";

const CourseListPage = () => {
  const authHeader = useAuthHeader();
  const confirm = useConfirm();

  const [loading, setLoading] = useState(true);

  const [courses, setCourses] = useState<Course[]>([]);
  const [seleted, setSelected] = useState<string>("");
  const [index, setIndex] = useState(0);

  const [guarantors, setGuarantors] = useState<string[]>([]);

  const [showDialog, setShowDialog] = useState(false);

  const getCourses = async () => {
    await axios
      .get(`${import.meta.env.VITE_SERVER_HOST}courses`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const getGuarantors = async () => {
    setLoading(true);
    await axios
      .get(`${import.meta.env.VITE_SERVER_HOST}users/guarantors`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        setGuarantors(res.data.map((g: Guarantor) => g.id));
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const createCourse = async (
    id: string,
    name: string,
    annotation: string,
    guarantor: string
  ) => {
    await axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}courses`,
        { id, name, annotation, guarantor },
        { headers: { Authorization: authHeader() } }
      )
      .then(() => {
        setCourses((oldCourses) => {
          const newCourses = [...oldCourses];
          newCourses.push({ id, name, annotation, guarantor });
          return newCourses;
        });
      })
      .catch((err) => console.error(err.message));
  };

  const editCourse = async (
    id: string,
    name: string,
    annotation: string,
    guarantor: string
  ) => {
    await axios
      .put(
        `${import.meta.env.VITE_SERVER_HOST}courses/${seleted}`,
        {
          id,
          name,
          annotation,
          guarantor,
        },
        {
          headers: {
            Authorization: authHeader(),
          },
        }
      )
      .then((res) => {
        console.log(res.data.msg);
        setCourses((oldCourses) => {
          const newCourses = [...oldCourses];
          newCourses[index].id = id;
          newCourses[index].name = name;
          newCourses[index].annotation = annotation;
          newCourses[index].guarantor = guarantor;
          return newCourses;
        });
        setSelected(id);
      })
      .catch((err) => console.error(err.message));
  };

  const deleteCourse = async () => {
    confirm({ description: "Chcete smazat předmět?", confirmationText: "Ano", cancellationText: "Ne", title: "Smazání předmětu", confirmationButtonProps: { color: "error" }  })
      .then(async () => {
        await axios
          .delete(`${import.meta.env.VITE_SERVER_HOST}courses/${seleted}`, {
            headers: {
              Authorization: authHeader(),
            },
          })
          .then((res) => {
            console.log(res.data.msg);
            setSelected("");
            setIndex(0);
            setCourses(courses.filter((course: Course) => course.id !== seleted));
          })
          .catch((err) => console.error(err.message));
      })
      .catch(() => {
        
      });
    
  };

  const toggleDialog = (value: boolean) => {
    setShowDialog(value);
  };

  const handleSelect = (id: string, i: number) => {
    setSelected(id);
    setIndex(i);
  };

  useEffect(() => {
    getCourses();
    getGuarantors();
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
        />
      </div>
      <CreateCourseDialog
        showDialog={showDialog}
        guarantors={guarantors}
        toggleDialog={toggleDialog}
        createCourse={createCourse}
      />
    </div>
  );
};

export default CourseListPage;
