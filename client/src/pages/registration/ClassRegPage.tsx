import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { Box, Select, MenuItem, SelectChangeEvent } from "@mui/material";

type Instance = {
  id: number;
  type: string;
  recurrence: string;
  capacity: number;
  duration: string;
  room: string;
  lecturer: string;
  start_time: string;
  day: string;
  order: number;
};

const ClassRegPage = () => {
  const dispatch = useDispatch();
  const authHeader = useAuthHeader();
  const auth = useAuthUser();

  const [status, setStatus] = useState("");
  const [instances, setInstances] = useState<Instance[]>([]);

  useEffect(() => {
    async function fetchInstances() {
      try {
        dispatch(setLoadingContentState(true));

        const status_response = await fetch(
          `${import.meta.env.VITE_SERVER_HOST}registrations/active`,
          {
            method: "GET",
            headers: {
              authorization: authHeader(),
            },
          }
        );
        const status_json = await status_response.json();

        setStatus(status_json);

        if (
          !["IDLE", "COURSES IN PROGRESS", "SCHEDULING"].includes(status_json)
        ) {
          const instances_response = await fetch(
            `${import.meta.env.VITE_SERVER_HOST}registrations/instances/${
              auth()?.id
            }/reg_data`,
            {
              method: "GET",
              headers: {
                authorization: authHeader(),
              },
            }
          );
          const instances_json = await instances_response.json();

          setInstances(instances_json);
        }

        dispatch(setLoadingContentState(false));
      } catch (error) {
        dispatch(setLoadingContentState(false));
        console.error("Error fetching courses:", error);
      }
    }

    fetchInstances();
  }, []);

  const handleChange = async (id: number, e: SelectChangeEvent<number>) => {
    dispatch(setLoadingContentState(true));

    await fetch(
      `${import.meta.env.VITE_SERVER_HOST}registrations/instances/${id}/${
        auth()?.id
      }`,
      {
        method: "DELETE",
        headers: {
          authorization: authHeader(),
        },
      }
    );

    if (e.target.value !== 0) {
      await fetch(
        `${import.meta.env.VITE_SERVER_HOST}registrations/instances/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: authHeader(),
          },
          body: JSON.stringify({
            instance: id,
            student: auth()?.id,
            order: e.target.value,
          }),
        }
      );
    }

    const instances_response = await fetch(
      `${import.meta.env.VITE_SERVER_HOST}registrations/instances/${
        auth()?.id
      }/reg_data`,
      {
        method: "GET",
        headers: {
          authorization: authHeader(),
        },
      }
    );
    const instances_json = await instances_response.json();

    setInstances(instances_json);

    dispatch(setLoadingContentState(false));
  };

  return (
    <Box>
      {!["IDLE", "COURSES IN PROGRESS", "SCHEDULING"].includes(status) ? (
        instances.map((instance: Instance) => (
          <Box
            key={instance.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
            }}
          >
            <span>{instance.type}</span>
            <span>{instance.recurrence}</span>
            <span>{instance.capacity}</span>
            <span>{instance.duration}</span>
            <span>{instance.room}</span>
            <span>{instance.lecturer}</span>
            <span>{instance.start_time}</span>
            <span>{instance.day}</span>
            <Select
              labelId="select-label"
              value={instance.order}
              onChange={(e) => handleChange(instance.id, e)}
            >
              <MenuItem value={0}>neregistrovat</MenuItem>
              {Array.from(Array(10).keys()).map((num: number) => (
                <MenuItem key={num} value={num + 1}>
                  {num + 1}
                </MenuItem>
              ))}
            </Select>
          </Box>
        ))
      ) : (
        <p>modul registrací vyučování ještě nebyl spuštěn</p>
      )}
    </Box>
  );
};

export default ClassRegPage;
