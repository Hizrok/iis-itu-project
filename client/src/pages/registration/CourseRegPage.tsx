import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import Course from "../../components/common/Types/Course";
import { Box, Checkbox } from "@mui/material";

type CourseRegistration = {
  id: string;
  name: string;
  registered: boolean;
};

const CourseRegPage = () => {
  const dispatch = useDispatch();
  const authHeader = useAuthHeader();
  const auth = useAuthUser();

  const [courses, setCourses] = useState<CourseRegistration[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        dispatch(setLoadingContentState(true));

        const courses_response = await fetch("http://localhost:3000/courses", {
          method: "GET",
          headers: {
            authorization: authHeader(),
          },
        });
        const courses_json = await courses_response.json();

        const registered_response = await fetch(
          `http://localhost:3000/registrations/courses/${auth()?.id}`,
          {
            method: "GET",
            headers: {
              authorization: authHeader(),
            },
          }
        );

        let registered: string[] = [];
        if (registered_response.ok) {
          const registered_json = await registered_response.json();
          registered = registered_json.map((course: Course) => course.id);
        }

        setCourses(
          courses_json.map((course: Course) => ({
            id: course.id,
            name: course.name,
            registered: registered.includes(course.id),
          }))
        );

        dispatch(setLoadingContentState(false));
      } catch (error) {
        dispatch(setLoadingContentState(false));
        console.error("Error fetching courses:", error);
      }
    }

    fetchCourses();
  }, []);

  const handleChange = (index: number) => {
    async function changeRegistration(registered: boolean) {
      try {
        dispatch(setLoadingContentState(true));

        if (!registered) {
          await fetch("http://localhost:3000/registrations/course", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: authHeader(),
            },
            body: JSON.stringify({
              course: courses[index].id,
              student: auth()?.id,
            }),
          });
        } else {
          await fetch(
            `http://localhost:3000/registrations/courses/${courses[index].id}/${
              auth()?.id
            }`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                authorization: authHeader(),
              },
            }
          );
        }

        dispatch(setLoadingContentState(false));
      } catch (error) {
        dispatch(setLoadingContentState(false));
        console.error("Error while registering:", error);
      }
    }

    changeRegistration(courses[index].registered);

    setCourses((oldCourses) => {
      const newCourses = [...oldCourses];
      newCourses[index].registered = !oldCourses[index].registered;
      return newCourses;
    });
  };

  return (
    <Box>
      {courses.map((course: CourseRegistration, i) => (
        <Box
          key={i}
          sx={{ display: "grid", gridTemplateColumns: "70px 500px 50px" }}
        >
          <p>{course.id}</p>
          <p>{course.name}</p>
          <Checkbox
            checked={course.registered}
            onChange={() => handleChange(i)}
          />
        </Box>
      ))}
    </Box>
  );
};

export default CourseRegPage;
