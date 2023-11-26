import { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import { useDispatch } from "react-redux";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import CourseList from "../../components/lists/courseListComponent";
import Course from "../../components/common/Types/Course";
import Filter from "../../components/common/Filters/filter";

const CourseListPage = () => {
  const authHeader = useAuthHeader();
  const dispatch = useDispatch();

  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);

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
    setFilteredCourses(json_courses);
    dispatch(setLoadingContentState(false));
  }

  const sortCourses = (courses: Course[], sortBy: string, descending: boolean) => {
    return courses.slice().sort((a: any, b: any) => {
      const order = descending ? -1 : 1;
      return a[sortBy].localeCompare(b[sortBy]) * order;
    });
  };

  const filterCourses = (filterType: string, isDescending: boolean) => {
    setFilteredCourses(sortCourses(courses, filterType, isDescending));
  }


  if (courses.length !== 0) {
    return (
      <div className="course-page">
        <h2>Seznam Předmětů</h2>
        <Filter onFilterChange={filterCourses} />
        <CourseList courses={filteredCourses} />
      </div>
    );
  }
  else {
    return (<>Loading...</>);
  }
}

export default CourseListPage;