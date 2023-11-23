import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useParams } from "react-router-dom";
import { Stack, Typography } from "@mui/material";

type Course = {
  course_id: string;
  course_name: string;
  course_annotation: string;
  course_guarantor_login: string;
};

const CourseDetailsPage = () => {
    const params = useParams()

  const dispatch = useDispatch();

  const [course, setCourse] = useState<Course>();

  useEffect(() => {
    async function fetchcourse() {
      dispatch(setLoadingContentState(true));
      try{
        const link = `http://localhost:3000/courses/${params.courseID}`;
          const response = await fetch(link, {
              method: "GET", 
              headers: {
                "Content-Type": "application/json"
              }
          });
          const course_json = await response.json();
      
          setCourse(course_json[0]);
          
          dispatch(setLoadingContentState(false));
      }
      catch(err){
          console.log(err);
          dispatch(setLoadingContentState(false));
      }
      
    }

    fetchcourse();
  }, [params]);

  if(course){
    return (
        <Stack spacing={2}>
            <Typography variant='h6'>{course?.course_name} ({course?.course_id})</Typography>
            <Typography>Garant: {course?.course_guarantor_login}</Typography>
            <Typography>Anotace: {course?.course_annotation}</Typography>
        </Stack>
      );
  }
  return (
    <></>
  );
  
};

export default CourseDetailsPage;
