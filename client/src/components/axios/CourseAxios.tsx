import axios from "axios";
import { Course } from "../common/Types/Course";

export const getCourses = async (
  setLoading: Function,
  setCourses: Function,
  authHeader: Function,
) => {
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

export const createCourse = async (
    id: string,
    name: string,
    annotation: string,
    guarantor: string,
    setCourses: Function,
    authHeader: Function,
  ) => {
    return await axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}courses`,
        { id, name, annotation, guarantor },
        { headers: { Authorization: authHeader() } }
      )
      .then(() => {
        setCourses((oldCourses: Course[]) => {
          const newCourses = [...oldCourses];
          newCourses.push({ id, name, annotation, guarantor });
          return newCourses;
        });
      })
      .catch(error => { console.error(error); throw error; });
  };

export const deleteCourse = async (
  seleted: string,
  resetSelected: Function,
  authHeader: Function,
) => {
  return await axios
    .delete(`${import.meta.env.VITE_SERVER_HOST}courses/${seleted}`, {
      headers: {
        Authorization: authHeader(),
      },
    })
    .then((res) => {
      console.log(res.data.msg);
      resetSelected();
    })
    .catch(error => { console.error(error); throw error; });
  };

export const editCourse = async (
    id: string,
    name: string,
    annotation: string,
    guarantor: string,
    index: number,
    setCourses: Function,
    setSelected: Function,
    authHeader: Function,
  ) => {
    return await axios
      .put(
        `${import.meta.env.VITE_SERVER_HOST}courses/${id}`,
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
        setCourses((oldCourses: Course[]) => {
          const newCourses = [...oldCourses];
          newCourses[index].id = id;
          newCourses[index].name = name;
          newCourses[index].annotation = annotation;
          newCourses[index].guarantor = guarantor;
          return newCourses;
        });
        setSelected(id);
      })
      .catch(error => { console.error(error); throw error; });
  };

