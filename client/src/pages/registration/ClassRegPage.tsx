import { useEffect, useState } from "react";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { Box, Select, MenuItem } from "@mui/material";
import axios from "axios";

type Instance = {
  id: number;
  course: string;
  type: string;
  recurrence: string;
  capacity: number;
  lecturer: string;
  room: string;
  day: string;
  start_time: string;
  duration: string;
  order: number;
};

const ClassRegPage = () => {
  const authHeader = useAuthHeader();
  const auth = useAuthUser();

  const [state, setState] = useState(0);
  const [instances, setInstances] = useState<Instance[]>([]);

  const getActiveRegistration = async () => {
    let fetchedState = 0;
    await axios
      .get(`${import.meta.env.VITE_SERVER_HOST}registrations/active`)
      .then((res) => {
        fetchedState = res.data.state;
        setState(res.data.state);
      })
      .catch((err) => console.error(err.message));
    return fetchedState;
  };

  const getInstances = async () => {
    await axios
      .get(
        `${import.meta.env.VITE_SERVER_HOST}registrations/instances/${
          auth()?.id
        }`,
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

  const handleChange = async (e: any, index: number) => {
    // if order === null and value !== 0 then create
    // if order and value !== 0 then update
    // if order and value === 0 then delete
    const instance = instances[index];
    const order = e.target.value;

    if (instance.order === -1 && order !== -1) {
      // create
      axios
        .post(
          `${import.meta.env.VITE_SERVER_HOST}registrations/instances`,
          {
            instance: instance.id,
            student: auth()?.id,
            order,
          },
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
            newInstances[index].order = order;
            return newInstances;
          });
        })
        .catch((err) => console.error(err.message));
    } else if (instance.order !== -1 && order !== -1) {
      // update
      axios
        .put(
          `${import.meta.env.VITE_SERVER_HOST}registrations/instances/${
            auth()?.id
          }`,
          {
            instance: instance.id,
            order,
          },
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
            newInstances[index].order = order;
            return newInstances;
          });
        })
        .catch((err) => console.error(err.message));
    } else if (instance.order !== -1 && order === -1) {
      // delete
      axios
        .delete(
          `${import.meta.env.VITE_SERVER_HOST}registrations/instances/${
            instance.id
          }/${auth()?.id}`,
          {
            headers: {
              Authorization: authHeader(),
            },
          }
        )
        .then((res) => {
          console.log(res.data.msg);
          setInstances((oldInstances) => {
            const newInstances = [...oldInstances];
            newInstances[index].order = -1;
            return newInstances;
          });
        })
        .catch((err) => console.error(err.message));
    }
  };

  useEffect(() => {
    const fetchInstances = async () => {
      const fetchedState = await getActiveRegistration();
      if (fetchedState >= 4) {
        getInstances();
      }
    };

    fetchInstances();
  }, []);

  if (state < 4) {
    return <div>Modul vyučování ještě nebyl spuštěn</div>;
  }

  return (
    <Box>
      <h2>Registrace vyučování</h2>
      {instances.map((i: Instance, index: number) => (
        <div
          key={i.id}
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <span>{i.course}</span>
          <span>{i.type}</span>
          <span>{i.recurrence}</span>
          <span>{i.capacity}</span>
          <span>{i.lecturer}</span>
          <span>{i.room}</span>
          <span>{i.day}</span>
          <span>{i.start_time}</span>
          <span>{i.duration}</span>
          <Select
            value={i.order}
            disabled={state > 4}
            onChange={(e) => handleChange(e, index)}
          >
            <MenuItem value={-1}>not selected</MenuItem>
            {[...Array(10).keys()].map((n) => (
              <MenuItem key={n} value={n + 1}>
                {n + 1}
              </MenuItem>
            ))}
          </Select>
        </div>
      ))}
    </Box>
  );
};

export default ClassRegPage;
