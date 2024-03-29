// @author Tomáš Vlach
// @author Jan Kapsa
// @author Petr Teichgráb

import { Button, InputLabel } from "@mui/material";
import { Activity } from "../../../components/common/Types/Course";
import ActivityDetail from "./ActivityDetail";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthHeader } from "react-auth-kit";
import CreateActivityDialog from "./CreateActivityDialog";
import dayjs from "dayjs";

type ActivityListProps = {
  course: string;
};

const ActivityList = ({ course }: ActivityListProps) => {
  const authHeader = useAuthHeader();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selected, setSelected] = useState(0);
  const [index, setIndex] = useState(0);

  const [showDialog, setShowDialog] = useState(false);

  const getActivities = async () => {
    await axios
      .get(`${import.meta.env.VITE_SERVER_HOST}activities?course=${course}`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        setActivities(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const createActivity = async (
    type: string,
    recurrence: string,
    capacity: number,
    duration: string
  ) => {
    duration = dayjs(duration).format('HH:mm:ss');
    return await axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}activities`,
        { course, type, recurrence, capacity, duration },
        {
          headers: {
            Authorization: authHeader(),
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const id = res.data.id;
        setActivities((oldActivities) => {
          const newActivities = [...oldActivities];
          newActivities.push({
            id,
            type,
            recurrence,
            capacity,
            duration,
            lecturers: [],
          });
          return newActivities;
        });
      })
      .catch(error => { console.error(error); throw error; });
  };

  const editActivity = async (
    type: string,
    recurrence: string,
    capacity: number,
    duration: string
  ) => {
    duration = dayjs(duration).format('HH:mm:ss');
    return await axios
      .put(
        `${import.meta.env.VITE_SERVER_HOST}activities/${selected}`,
        { type, recurrence, capacity, duration },
        {
          headers: {
            Authorization: authHeader(),
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data.msg);
        setActivities((oldActivities) => {
          const newActivities = [...oldActivities];
          newActivities[index].type = type;
          newActivities[index].recurrence = recurrence;
          newActivities[index].capacity = capacity;
          newActivities[index].duration = duration;
          return newActivities;
        });
      })
      .catch(error => { console.error(error); throw error; });
  };

  const deleteActivity = async (id: number) => {
    return await axios
      .delete(`${import.meta.env.VITE_SERVER_HOST}activities/${id}`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        console.log(res.data.msg);
        setActivities(activities.filter((a: Activity) => a.id !== id));
        setSelected(0);
        setIndex(0);
      })
      .catch(error => { console.error(error); throw error; });
  };

  const handleSelect = (id: number, i: number) => {
    setSelected(id);
    setIndex(i);
  };

  const toggleDialog = (value: boolean) => {
    setShowDialog(value);
  };

  useEffect(() => {
    getActivities();
  }, []);

  return (
    <div>
      <InputLabel sx={{ marginTop: "10px" }}>Activities</InputLabel>
      <Button variant="contained" onClick={() => toggleDialog(true)}>
        Add activity
      </Button>
      {activities.map((a: Activity, i: number) => (
        <div key={i} onClick={() => handleSelect(a.id, i)}>
          <ActivityDetail
            course={course}
            activity={a}
            selected={a.id === selected}
            editActivity={editActivity}
            deleteActivity={deleteActivity}
          />
        </div>
      ))}
      <CreateActivityDialog
        showDialog={showDialog}
        toggleDialog={toggleDialog}
        createActivity={createActivity}
      />
    </div>
  );
};

export default ActivityList;
