import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import CourseList from "../../components/lists/courseListComponent";
import { useAuthHeader } from "react-auth-kit";

type User = {
  id: string;
  role: string;
  name: string;
  surname: string;
}

type Course = {
  id: string;
  name: string;
  annotation: string;
  guarantor: User;
};

const MainCoursesListPage = () => {

  const authHeader = useAuthHeader();
  const dispatch = useDispatch();

  const [courses, setCourses] = useState<Course[]>([]);

  // let courses = "loading..."

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    dispatch(setLoadingContentState(true));
    const response = await fetch("http://localhost:3000/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authHeader(),
        },
      });
      const json_courses = await response.json();

    setCourses(json_courses);
    dispatch(setLoadingContentState(false));
  }

  if(courses.length!==0){
    return (
      <CourseList courses={courses}/>
    );
  }  
  else{
    return(<></>);
  }
};

export default MainCoursesListPage;
