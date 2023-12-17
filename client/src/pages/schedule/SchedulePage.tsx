import { useAuthHeader, useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/style.css";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import csLocale from "@fullcalendar/core/locales/cs";
import styled from "@emotion/styled";
import axios from "axios";

//@author: Petr Teichgráb

// "id": ITU,
//     "course": "Tvorba uživatelských rozhraní",
//     "type": "přednáška",
//     "recurrence": "každý",
//     "capacity": 100,
//     "day": "pondělí",
//     "start_time": "12:00:00",
//     "duration": "02:00:00",
//     "room": "A101",
//     "lecturer": "Pavel Petr"

type Activity = {
  id: string;
  course: string;
  type: string;
  recurrence: string;
  capacity: string;
  day: string;
  start_time: string;
  duration: string;
  room: string;
  lecturer: string;
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

const dayMap: Record<string, number> = {
  pondělí: 1,
  úterý: 2,
  středa: 3,
  čtvrtek: 4,
  pátek: 5,
};

type ReturnPageProps = {
  headerName: string;
  errorMessage: string;
};

const SchedulePage = () => {
    const navigate = useNavigate();
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const authHeader = useAuthHeader();
  const dispatch = useDispatch();

  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    getActivities();
  }, [isAuthenticated()]);

  const getActivities = () => {
    if (isAuthenticated()) {
      if (auth()!.role === "student") {
        fetchActivitiesStudent();
      } else {
        fetchActivitiesTeacher();
      }
    }
  };

  async function fetchActivitiesStudent() {
    fetchActivities(
      import.meta.env.VITE_SERVER_HOST + `registrations/instances/${auth()!.id}`
    );
  }

  async function fetchActivitiesTeacher() {
    fetchActivities(
      import.meta.env.VITE_SERVER_HOST + "instances?lecturer=" + auth()!.id
    );
  }

  async function fetchActivities(URL: string) {
    dispatch(setLoadingContentState(true));
    axios
      .get(URL, { headers: { Authorization: authHeader() } })
      .then((res) => {
        console.log(res.data);
        setActivities(
          res.data.filter(
            (a: any) => a.registered === undefined || a.registered
          )
        );
      })
      .catch((err) => console.error(err.message))
      .finally(() => {
        dispatch(setLoadingContentState(false));
      });
  }

  const generateRandomColor = (lightness = 60, id: string) => {
    let storedColor = localStorage.getItem(id);

    if (storedColor) {
      // Pokud je k dispozici ulozena barva return
      return storedColor;
    }
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    const limitedLightness = Math.min(100, Math.max(30, lightness));

    const rgb = [
      parseInt(color.slice(1, 3), 16),
      parseInt(color.slice(3, 5), 16),
      parseInt(color.slice(5, 7), 16),
    ];

    const adjustedRgb = rgb.map((value) =>
      Math.round(value * (limitedLightness / 100))
    );

    color = `#${adjustedRgb
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")}`;

    localStorage.setItem(id, color);

    return color;
  };

  const subjects = activities.map((activity) => {
    return {
      title: activity.course,
      backgroundColor: generateRandomColor(70, activity.id),
      daysOfWeek: [dayMap[activity.day]],
      startTime: activity.start_time,
      endTime: calculateEndTime(activity.start_time, activity.duration),
      extendedProps: {
        id: activity.id,
        room: activity.room,
        lecturer: activity.lecturer,
        type: activity.type,
        duration: activity.duration,
        reccurence: activity.recurrence
      }
    };
  });

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

  // Pomocná funkce pro přidání nuly před jednociferné číslo
  function padZero(num: any) {
    return num < 10 ? `0${num}` : `${num}`;
  }

  // návratová stránka
  const ReturnPage = (props: ReturnPageProps) => {
    return (
      <div>
        <div className="course-page">
          <div className="list-pages-list-container">
            <h2>{props.headerName}</h2>
          </div>
          {activities.length === 0 && props.errorMessage}
        </div>
        <div className="schedule">
          <StyleWrapper>
            <Fullcalendar
              slotMinTime={"08:00"}
              slotMaxTime={"22:00"}
              events={subjects}
              locale={csLocale}
              weekends={false}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                start: "prev, next",
                center: "title",
                end: "dayGridMonth, timeGridWeek, timeGridDay",
              }}
              eventClick={handleClickContent}
              eventContent={renderEventContent}
              initialView={"timeGridWeek"}
            />
          </StyleWrapper>
        </div>
      </div>
    );
  };

  function handleClickContent(eventInfo : any) {
    navigate(`/courses/${eventInfo.event.title}`);
}


  function renderEventContent(eventInfo : any) {
    if(eventInfo.event.extendedProps.duration > "02:00:00"){
        return (
        <div className="lectureEvent">
            <b>{eventInfo.timeText}</b><br/>
            <b>{eventInfo.event.title}</b><br/>
            <b>{eventInfo.event.extendedProps.type}</b><br/>
            <b>{eventInfo.event.extendedProps.room}</b><br/>
            <b>{eventInfo.event.extendedProps.lecturer}</b>
        </div>
        )
    }
    else if(eventInfo.event.extendedProps.duration == "02:00:00"){
        return (
        <div className="lectureEvent">
            <b>{eventInfo.timeText}</b><br/>
            <b>{eventInfo.event.title}</b><br/>
            <b>{eventInfo.event.extendedProps.type}</b><br/>
            <b>{eventInfo.event.extendedProps.lecturer}</b>
        </div>
        )
    }
    else if(eventInfo.event.extendedProps.duration >= "01:00:00" && 
        eventInfo.event.extendedProps.duration < "02:00:00"){
    return (
        <div className="lectureEvent">
            <b>{eventInfo.timeText}</b><br/>
            <b>{eventInfo.event.title}</b>
            <b>{eventInfo.event.extendedProps.type}</b><br/>
        </div>
        )
    }
    else if(eventInfo.event.extendedProps.duration < "01:00:00"){
    return (
        <div className="lectureEvent">
            <b>{eventInfo.event.title}</b>
        </div>
        )
    }
        
  }

  const AdminPage = () => {
    return (
      <div className="course-page">
        <div className="list-pages-list-container">
          <h2>Přihlášený jako admin</h2>
        </div>
        <h3>Rozvrh</h3>
        <p>Zde uživetelé uvidí seznam všech svých zaregistrovaných aktivit.</p>
      </div>
    );
  };

  if (isAuthenticated()) {
    if (auth()!.role === "student") {
      return (
        <ReturnPage
          headerName="Seznam Registrovaných Aktivit"
          errorMessage="Žádné aktivity nejsou registrovány"
        />
      );
    } else if (auth()!.role === "vyučující") {
      return (
        <ReturnPage
          headerName="Seznam Vyučovaných Aktivit"
          errorMessage="Nevyučujete žádné aktivity"
        />
      );
    } else if (auth()!.role === "garant") {
      return (
        <ReturnPage
          headerName="Seznam Vyučovaných Aktivit"
          errorMessage="Nevyučujete žádné aktivity"
        />
      );
    } else if (auth()!.role === "admin") {
      return <AdminPage />;
    } else {
      return <></>;
    }
  } else {
    return <></>;
  }
};

export default SchedulePage;
