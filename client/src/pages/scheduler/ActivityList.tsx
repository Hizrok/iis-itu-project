import { InputLabel } from "@mui/material";
import { Activity } from "../../components/common/Types/Course";
import ActivityDetail from "./ActivityDetail";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthHeader } from "react-auth-kit";

type ActivityListProps = {
  course: string;
};

const ActivityList = ({ course }: ActivityListProps) => {
  const authHeader = useAuthHeader();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selected, setSelected] = useState(0);
  const [, setIndex] = useState(0);

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

  const handleSelect = (id: number, i: number) => {
    setSelected(id);
    setIndex(i);
  };

  useEffect(() => {
    getActivities();
  }, []);

  return (
    <div>
      <InputLabel sx={{ marginTop: "10px" }}>Activities</InputLabel>
      {activities.map((a: Activity, i: number) => (
        <div key={i} onClick={() => handleSelect(a.id, i)}>
          <ActivityDetail
            course={course}
            activity={a}
            selected={a.id === selected}
          />
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
