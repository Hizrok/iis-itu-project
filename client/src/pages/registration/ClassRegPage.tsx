// @author Tomáš Vlach
// @author Jan Kapsa

import { useEffect, useState } from "react";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { Box, Select, MenuItem } from "@mui/material";
import axios from "axios";
import Fullcalendar from "@fullcalendar/react";
import csLocale from "@fullcalendar/core/locales/cs";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styled from "@emotion/styled";
import { toast } from "react-toastify";

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

const dayMap: Record<string, number> = {
  pondělí: 1,
  úterý: 2,
  středa: 3,
  čtvrtek: 4,
  pátek: 5,
};

const StyleWrapper = styled.div`
  .fc-button.fc-prev-button,
  .fc-button.fc-next-button,
  .fc-button.fc-button-primary {
    background: rgba(106, 90, 205, 1);
    background-image: none;
  }
  .fc th {
    background: rgba(106, 90, 205, 1);
  }
  .fc-col-header-cell-cushion {
    color: white;
  }
  .fc-scrollgrid-sync-table {
    display: none;
  }
`;

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
          toast.success(
            `vyučování ${instance.course} ${instance.type} ${instance.recurrence} ${instance.day} ${instance.start_time} bylo vybráno jako číslo ${order}`
          );
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
          toast.success(
            `vyučování ${instance.course} ${instance.type} ${instance.recurrence} ${instance.day} ${instance.start_time} bylo vybráno jako číslo ${order}`
          );
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
          toast.success(
            `vyučování ${instance.course} ${instance.type} ${instance.recurrence} ${instance.day} ${instance.start_time} bylo odebráno`
          );
          setInstances((oldInstances) => {
            const newInstances = [...oldInstances];
            newInstances[index].order = -1;
            return newInstances;
          });
        })
        .catch((err) => console.error(err.message));
    }
  };

  // @author Petr Teichgráb
  function calculateEndTime(startTime: any, duration: any) {
    // Rozdělení začátečního času na hodiny, minuty a sekundy
    const [startHours, startMinutes, startSeconds] = startTime
      .split(":")
      .map(Number);

    // Rozdělení délky na hodiny, minuty a sekundy
    const [durationHours, durationMinutes, durationSeconds] = duration
      .split(":")
      .map(Number);

    // Výpočet konce události
    let endHours = startHours + durationHours;
    let endMinutes = startMinutes + durationMinutes;
    let endSeconds = startSeconds + durationSeconds;

    // Převedení přebytečných minut a sekund na hodiny a minuty
    endMinutes += Math.floor(endSeconds / 60);
    endSeconds %= 60;
    endHours += Math.floor(endMinutes / 60);
    endMinutes %= 60;

    // Formátování výsledného času
    const formattedEndTime = `${padZero(endHours)}:${padZero(
      endMinutes
    )}:${padZero(endSeconds)}`;

    return formattedEndTime;
  }

  function padZero(num: any) {
    return num < 10 ? `0${num}` : `${num}`;
  }

  useEffect(() => {
    const fetchInstances = async () => {
      const fetchedState = await getActiveRegistration();
      if (fetchedState >= 4) {
        getInstances();
      }
    };

    fetchInstances();
  }, []);

  function renderEventContent(eventInfo: any) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <b>{eventInfo.timeText}</b>
        <b>{eventInfo.event.title}</b>
        <b>{eventInfo.event.extendedProps.type}</b>
        <Select
          style={{ maxWidth: "75px", maxHeight: "30px", color: "white" }}
          disabled={state > 4}
          value={eventInfo.event.extendedProps.order}
          onChange={(e) => handleChange(e, eventInfo.event.extendedProps.index)}
        >
          <MenuItem value={-1}>not selected</MenuItem>
          {[...Array(10).keys()].map((n) => (
            <MenuItem key={n} value={n + 1}>
              {n + 1}
            </MenuItem>
          ))}
        </Select>
      </div>
    );
  }

  if (state < 4) {
    return <div>Modul vyučování ještě nebyl spuštěn</div>;
  }

  return (
    <Box>
      <h2>Registrace vyučování</h2>
      <StyleWrapper>
        <Fullcalendar
          slotMinTime={"08:00"}
          slotMaxTime={"22:00"}
          events={instances.map((i: Instance, index: number) => ({
            title: i.course,
            groupId: "blueEvents",
            daysOfWeek: [dayMap[i.day]],
            startTime: i.start_time,
            endTime: calculateEndTime(i.start_time, i.duration),
            overlap: false,
            extendedProps: {
              index,
              order: i.order,
              type: i.type,
            },
          }))}
          eventContent={renderEventContent}
          locale={csLocale}
          weekends={false}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            start: "prev, next",
            center: "title",
            end: "",
          }}
          initialView={"timeGridWeek"}
        />
      </StyleWrapper>
    </Box>
  );
};

export default ClassRegPage;
