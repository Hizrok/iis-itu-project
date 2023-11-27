import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import CourseList from "../../components/lists/courseListComponent";
import { useAuthHeader } from "react-auth-kit";
import Filter from "../../components/common/Filters/filter";

// type User = {
//   id: string;
//   role: string;
//   name: string;
//   surname: string;
// }

type Course = {
  id: string;
  name: string;
  guarantor: string;
};

const MainCoursesListPage = () => {
  const authHeader = useAuthHeader();
  const dispatch = useDispatch();

  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);

  // let courses = "loading..."

  useEffect(() => {
    fetchCourses();
  }, []);

  const sortCourses = (
    courses: Course[],
    sortBy: string,
    descending: boolean
  ) => {
    return courses.slice().sort((a: any, b: any) => {
      const order = descending ? -1 : 1;
      return a[sortBy].localeCompare(b[sortBy]) * order;
    });
  };

  const filterCourses = (filterType: string, isDescending: boolean) => {
    setFilteredCourses(sortCourses(courses, filterType, isDescending));
  };

  async function fetchCourses() {
    dispatch(setLoadingContentState(true));
    try{
      const response = await fetch(import.meta.env.VITE_SERVER_HOST+"courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authHeader(),
        },
      });
      const json_courses = await response.json();
    
      setFilteredCourses(json_courses);
      setCourses(json_courses);
      dispatch(setLoadingContentState(false));
    }
    catch(err){
      console.log(err);
      dispatch(setLoadingContentState(false));
    }
  }

  if (courses.length !== 0) {
    return (
      <div className="course-page">
        <div className="list-pages-list-container">
          <h2>Seznam Předmětů</h2>
        </div>
        <Filter onFilterChange={filterCourses} />
        <CourseList courses={filteredCourses} />
      </div>
    );
  } else {
    return (
      <div className="course-page">
        <div className="list-pages-list-container">
          <h2>Seznam Předmětů</h2>
        </div>
        Žádné předměty nebyli načteny
      </div>
    );
  }
};

export default MainCoursesListPage;
