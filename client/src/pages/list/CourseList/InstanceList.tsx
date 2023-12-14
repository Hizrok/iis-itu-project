import { Button, InputLabel } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import { Instance } from "../../../components/common/Types/Course";
import InstanceDetail from "./InstanceDetail";

type InstanceListProps = {
  activity: number;
  lecturers: string[];
};

const InstanceList = ({ activity, lecturers }: InstanceListProps) => {
  const authHeader = useAuthHeader();

  const [rooms, setRooms] = useState<string[]>([]);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [selected, setSelected] = useState(0);
  const [index, setIndex] = useState(0);

  const getInstances = async () => {
    await axios
      .get(
        `${import.meta.env.VITE_SERVER_HOST}instances?activity=${activity}`,
        {
          headers: {
            Authorization: authHeader(),
          },
        }
      )
      .then((res) => {
        setInstances(res.data);
      })
      .catch((err) => console.error(err.message));
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
      .catch((err) => console.error(err.message));
  };

  const editInstance = async (
    room: string,
    lecturer: string,
    day: string,
    start_time: string
  ) => {
    await axios
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
      .catch((err) => console.error(err.message));
  };

  const deleteInstance = async (id: number) => {
    await axios
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
      .catch((err) => console.error(err.message));
  };

  const handleSelect = (id: number, i: number) => {
    setSelected(id);
    setIndex(i);
  };

  useEffect(() => {
    getInstances();
    getRooms();
  }, []);

  return (
    <div>
      <InputLabel sx={{ marginTop: "10px" }}>Instances</InputLabel>
      <Button variant="contained">Add instance</Button>
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
    </div>
  );
};

export default InstanceList;
