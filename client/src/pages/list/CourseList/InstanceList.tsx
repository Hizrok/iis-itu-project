// @author Jan Kapsa

import { Button, InputLabel } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import { Instance, Activity } from "../../../components/common/Types/Course";
import InstanceDetail from "./InstanceDetail";
import CreateInstanceDialog from "./CreateInstanceDialog";
import dayjs from "dayjs";

type InstanceListProps = {
  course: string;
  activity: Activity;
  lecturers: string[];
};

const InstanceList = ({ course, activity, lecturers }: InstanceListProps) => {
  const authHeader = useAuthHeader();

  const [rooms, setRooms] = useState<string[]>([]);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [selected, setSelected] = useState(0);
  const [index, setIndex] = useState(0);

  const [showDialog, setShowDialog] = useState(false);

  const getInstances = async () => {
    return await axios
      .get(
        `${import.meta.env.VITE_SERVER_HOST}instances?activity=${activity.id}`,
        {
          headers: {
            Authorization: authHeader(),
          },
        }
      )
      .then((res) => {
        setInstances(res.data);
      })
      .catch(error => { console.error(error); throw error; });
  };

  const getRooms = async () => {
    await axios
      .get(`${import.meta.env.VITE_SERVER_HOST}rooms`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        setRooms(res.data.map((room: any) => room.id));
      })
      .catch(error => { console.error(error); throw error; });
  };

  const editInstance = async (
    room: string,
    lecturer: string,
    day: string,
    start_time: string
  ) => {
    start_time = dayjs(start_time).format('HH:mm:ss');
    return await axios
      .put(
        `${import.meta.env.VITE_SERVER_HOST}instances/${selected}`,
        { room, lecturer, day, start_time },
        {
          headers: {
            Authorization: authHeader(),
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data.msg);
        setInstances((oldInstances) => {
          const newInstances = [...oldInstances];
          newInstances[index].lecturer = lecturer;
          newInstances[index].room = room;
          newInstances[index].day = day;
          newInstances[index].start_time = start_time;
          return newInstances;
        });
      })
      .catch(error => { console.error(error); throw error; });
  };

  const deleteInstance = async (id: number) => {
    return await axios
      .delete(`${import.meta.env.VITE_SERVER_HOST}instances/${id}`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        console.log(res.data.msg);
        setInstances(instances.filter((i: Instance) => i.id !== id));
        setSelected(0);
        setIndex(0);
      })
      .catch(error => { console.error(error); throw error; });
  };

  const createInstance = async (
    room: string,
    lecturer: string,
    day: string,
    start_time: string
  ) => {
    start_time = dayjs(start_time).format('HH:mm:ss');
    return await axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}instances`,
        {
          activity: activity.id,
          room,
          lecturer,
          day,
          start_time,
        },
        {
          headers: {
            Authorization: authHeader(),
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const id = res.data.id;
        setInstances((oldInstances) => {
          const newInstances = [...oldInstances];
          newInstances.push({
            id,
            course,
            type: activity.type,
            room,
            lecturer,
            recurrence: activity.recurrence,
            day,
            start_time,
            duration: activity.duration,
            capacity: activity.capacity,
          });
          return newInstances;
        });
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
    getInstances();
    getRooms();
  }, []);

  return (
    <div>
      <InputLabel sx={{ marginTop: "10px" }}>Instances</InputLabel>
      <Button variant="contained" onClick={() => toggleDialog(true)}>
        Add instance
      </Button>
      <ul>
      {instances.map((instance: Instance, i: number) => (
        <div key={i} onClick={() => handleSelect(instance.id, i)}>
          <InstanceDetail
            instance={instance}
            lecturers={lecturers}
            rooms={rooms}
            selected={selected === instance.id}
            editInstance={editInstance}
            deleteInstance={deleteInstance}
          />
        </div>
      ))}
      </ul>
      <CreateInstanceDialog
        rooms={rooms}
        lecturers={lecturers}
        showDialog={showDialog}
        toggleDialog={toggleDialog}
        createInstance={createInstance}
      />
    </div>
  );
};

export default InstanceList;
