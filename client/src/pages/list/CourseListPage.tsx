import { useEffect, useState } from "react";

const CourseListPage = () => {
    type Course = {
        course_id: string,
        course_name: string,
        course_annotation: string,
        course_guarantor_login: string
    }
        
    const [courses, setCourses] = useState<Course[]>([]);

    // let courses = "loading..."

    useEffect(() => {
        async function fetchCourses() {
            const response = await fetch("http://localhost:3000/courses");
            const courses_json = await response.json();
    
            setCourses(courses_json);
            console.log(courses_json);
        }
        
        fetchCourses();
    }, []);


    return(
        <div>
            {
                courses.map(course => {
                    return <div key={course.course_id}>{course.course_id}</div>
                })
            }
        </div>
    )
}

export default CourseListPage;