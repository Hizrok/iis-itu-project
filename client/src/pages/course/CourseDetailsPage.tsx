import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useParams } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";

type Course = {
  id: string;
  name: string;
  annotation: string;
  guarantor: string;
  instances: Instance[];
};

type Instance = {
  id: number;
  type: string;
  recurrence: string;
  room: string;
  lecturer: string;
  day: string;
  start_time: string;
  duration: string;
  capacity: number;
};

const CourseDetailsPage = () => {
  const params = useParams();

  const dispatch = useDispatch();
  const authHeader = useAuthHeader();

  const [course, setCourse] = useState<Course>();

  const fetchCourse = async () => {
    dispatch(setLoadingContentState(true));
    await axios
      .get(`${import.meta.env.VITE_SERVER_HOST}courses/${params.courseID}`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => setCourse(res.data))
      .catch((err) => console.error(err.message))
      .finally(() => {
        dispatch(setLoadingContentState(false));
      });
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  return (
    <div>
      <Stack spacing={2}>
        <Typography variant="h6">
          {course?.name} ({course?.id})
        </Typography>
        <Typography>Garant: {course?.guarantor}</Typography>
        <Typography>Anotace: {course?.annotation}</Typography>
      </Stack>
      <h2>Seznam vyučování</h2>
      {course?.instances.map((i: Instance) => (
        <div key={i.id} style={{ display: "flex", gap: "10px" }}>
          <span>{i.type}</span>
          <span>{i.recurrence}</span>
          <span>{i.room}</span>
          <span>{i.lecturer}</span>
          <span>{i.day}</span>
          <span>{i.start_time}</span>
          <span>{i.duration}</span>
          <span>{i.capacity}</span>
        </div>
      ))}
    </div>
  );
};

export default CourseDetailsPage;
