import axios from "axios";
import { toast } from "react-toastify";
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
    await axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}courses`,
        { id, name, annotation, guarantor },
        { headers: { Authorization: authHeader() } }
      )
      .then(() => {
        setCourses((oldCourses: Course[]) => {
          const newCourses = [...oldCourses];
          newCourses.push({ id, name, annotation, guarantor });
          toast.success('Předmět vytvořen');
          return newCourses;
        });
      })
      .catch((err) => {
        console.error(err.message);
        toast.error('Problém s tvořením předmětu');
      });
  };

export const deleteCourse = async (
  seleted: string,
  resetSelected: Function,
  confirm: Function,
  authHeader: Function,
) => {
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
            resetSelected();
            toast.success('Předmět vymazán');
          })
          .catch((err) => {
            console.error(err.message);
            toast.error('Problém s mazáním předmětu');
          });
      })
      .catch(() => {
        
      });
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
    await axios
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
        toast.success('Předmět aktualizován');
      })
      .catch((err) => {
        console.error(err.message);
        toast.error('Problém s aktualizováním předmětu');
      });
  };

