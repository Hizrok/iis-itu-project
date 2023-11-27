import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import CourseList from "../../components/lists/courseListComponent";
import { useAuthHeader, useAuthUser, useIsAuthenticated } from "react-auth-kit";
import Filter from "../../components/common/Filters/filter";
import Course from "../../components/common/Types/Course";

const HomePage = () => {

    const auth = useAuthUser();
    const isAuthenticated = useIsAuthenticated();
    const authHeader = useAuthHeader();
    const dispatch = useDispatch();

    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);

    // let courses = "loading..."

    useEffect(() => {
        getCourses();
    }, []);

    useEffect(() => {
        getCourses();
    }, [isAuthenticated()]);

    const getCourses = () => {
        if(isAuthenticated()){
            if(auth()!.role === "student"){
                fetchCoursesStudent();
                //fetchActivitiesStudent():
            }
            else if(auth()!.role === "vyučující" ){
                fetchCoursesTeacher();
                //fetchActivitiesTeacher():
            }
            else if(auth()!.role === "garant"){
                fetchCoursesGarant();
                //fetchActivitiesGarant():
            }
        }
    };

    const sortCourses = (courses: Course[], sortBy: string, descending: boolean) => {
        return courses.slice().sort((a: any, b: any) => {
            const order = descending ? -1 : 1;
            return a[sortBy].localeCompare(b[sortBy]) * order;
        });
    };

    const filterCourses = (filterType: string, isDescending: boolean) => {
    setFilteredCourses(sortCourses(courses, filterType, isDescending));
    }

    async function fetchCoursesStudent() {
        dispatch(setLoadingContentState(true));
        try{
            const response = await fetch(import.meta.env.VITE_SERVER_HOST+"registrations/courses/"+auth()!.id, {
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

    async function fetchCoursesTeacher() {
        dispatch(setLoadingContentState(true));
        try{
            const response = await fetch(import.meta.env.VITE_SERVER_HOST+"courses/instances?lecturer="+auth()!.id, {
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

    async function fetchCoursesGarant() {
        dispatch(setLoadingContentState(true));
        try{
            const response = await fetch(import.meta.env.VITE_SERVER_HOST+"courses?guarantor="+auth()!.id, {
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

    const returnList = (headerName: string, errorMessage: string) => {
        if(courses.length!==0){
            return (
              <div className="course-page">
                  <div className="list-pages-list-container">
                    <h2>Seznam Registrovaných Předmětů</h2>
                  </div>
                  <Filter onFilterChange={filterCourses} />
                  <CourseList courses={filteredCourses} />
                </div>
            );
        }  
        else{
            return(
            <div className="course-page">
                <div className="list-pages-list-container">
                    <h2>{headerName}</h2>
                </div>
                {errorMessage}
            </div>
            );
        }
    };

    if(isAuthenticated()){
        if(auth()!.role === "student"){
            returnList("Seznam Registrovaných Předmětů","Žádné předměty nejsou registrovány");
        }
        else if(auth()!.role === "vyučující"){
            returnList("Seznam Vyučovaných Předmětů","Nevyučujete žádné předměty");
        }   
        else if(auth()!.role === "garant"){
            returnList("Seznam Garantovaných Předmětů","Negarantujete žádné předměty");
        }
    else{
        return(
            <></>
        );
    }
    
    }
}

export default HomePage;