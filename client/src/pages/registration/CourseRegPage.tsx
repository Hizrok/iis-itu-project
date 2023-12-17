// @author Tomáš Vlach
// @author Jan Kapsa

import { useEffect, useState } from "react";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { Box, Checkbox, TextField } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

type CourseRegistration = {
  id: string;
  name: string;
  guarantor: string;
  registered: boolean;
};

const CourseRegPage = () => {
  const authHeader = useAuthHeader();
  const auth = useAuthUser();

  const [search, setSearch] = useState("");
  const [state, setState] = useState(0);
  const [courses, setCourses] = useState<CourseRegistration[]>([]);

  const getActiveRegistration = async () => {
    let fetchedState = 0;
    await axios
      .get(`${import.meta.env.VITE_SERVER_HOST}registrations/active`)
      .then((res) => {
        fetchedState = res.data.state;
        setState(res.data.state);
      })
      .catch((err) => console.error(err.message));
    return fetchedState;
  };

  const getCoursesWithRegData = async () => {
    await axios
      .get(
        `${import.meta.env.VITE_SERVER_HOST}registrations/courses/${
          auth()?.id
        }`,
        {
          headers: {
            Authorization: authHeader(),
          },
        }
      )
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => console.error(err.message));
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedState = await getActiveRegistration();
      if (fetchedState !== 0) {
        getCoursesWithRegData();
      }
    };

    fetchData();
  }, []);

  const handleChange = (index: number) => {
    if (!courses[index].registered) {
      axios
        .post(
          `${import.meta.env.VITE_SERVER_HOST}registrations/courses`,
          {
            course: courses[index].id,
            student: auth()?.id,
          },
          {
            headers: {
              Authorization: authHeader(),
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res.data.msg);
          toast.success(`Předmět ${courses[index].id} byl zaregistrován`);
          setCourses((oldCourses) => {
            const newCourses = [...oldCourses];
            newCourses[index].registered = !newCourses[index].registered;
            return newCourses;
          });
        })
        .catch((err) => console.error(err.message));
    } else {
      axios
        .delete(
          `${import.meta.env.VITE_SERVER_HOST}registrations/courses/${
            courses[index].id
          }/${auth()?.id}`,
          {
            headers: {
              Authorization: authHeader(),
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res.data.msg);
          toast.success(`Předmět ${courses[index].id} byl odregistrován`);
          setCourses((oldCourses) => {
            const newCourses = [...oldCourses];
            newCourses[index].registered = !newCourses[index].registered;
            return newCourses;
          });
        })
        .catch((err) => console.error(err.message));
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.guarantor.toLowerCase().includes(search.toLowerCase()) ||
      course.id.toLowerCase().includes(search.toLowerCase())
  );

  if (state === 0) {
    return <div>Modul registrací předmětů nebyl spuštěn</div>;
  }

  return (
    <Box sx={{ width: "600px", margin: "30px 50px" }}>
      <TextField
        fullWidth
        id="outlined-basic"
        label="Vyhledat předmět..."
        variant="outlined"
        sx={{ marginBottom: "50px" }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredCourses.map((c: CourseRegistration, i: number) => (
        <div
          key={c.id}
          style={{
            display: "grid",
            gridTemplateColumns: "50px 400px 100px 50px",
            alignItems: "center",
          }}
        >
          <span>{c.id}</span>
          <span>{c.name}</span>
          <span>{c.guarantor}</span>
          <Checkbox
            disabled={state !== 1}
            checked={c.registered || false}
            onChange={() => handleChange(i)}
          />
        </div>
      ))}
    </Box>
  );
};

export default CourseRegPage;
