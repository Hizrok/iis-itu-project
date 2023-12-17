import { useAuthHeader, useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import "../../styles/style.css";
import  Fullcalendar  from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import csLocale from '@fullcalendar/core/locales/cs';
import styled from "@emotion/styled";


//@author: Petr Teichgráb

// priklad dat:
//
//     "id": IMA1,
//     "course": "Matematicka analyza",
//     "type": "přednáška",
//     "recurrence": "každý",
//     "capacity": 100,
//     "day": "pondělí",
//     "start_time": "12:00:00",
//     "duration": "02:00:00",
//     "room": "A101",
//     "lecturer": "garant"

type Activity = {
    id: string;
    course: string;
    type: string;
    recurrence: string
    capacity: string;
    day: string;
    start_time: string;
    duration: string;
    room: string;
    lecturer: string;
}

const activitiesDummy: Activity[] = [
    {
      id: 'ITU',
      course: 'Tvorba uzivatelskych rozhrani',
      type: 'přednáška',
      recurrence: 'každý',
      capacity: '100',
      day: 'pondělí',
      start_time: '12:00:00',
      duration: '02:00:00',
      room: 'A101',
      lecturer: 'garant',
    },
    {
        id: 'IMA2',
        course: 'Matematika',
        type: 'cvičení',
        recurrence: 'každý týden',
        capacity: '30',
        day: 'úterý',
        start_time: '14:30:00',
        duration: '01:30:00',
        room: 'B202',
        lecturer: 'Dr. Novák',
      },
      {
        id: 'FYZ',
        course: 'Fyzika',
        type: 'seminář',
        recurrence: 'každý druhý týden',
        capacity: '20',
        day: 'středa',
        start_time: '10:00:00',
        duration: '02:30:00',
        room: 'C103',
        lecturer: 'Prof. Kovář',
      }
  ];
  
  type ReturnPageProps = {
    headerName: string;
    errorMessage: string;}

const SchedulePage = () => {

    const auth = useAuthUser();
    const isAuthenticated = useIsAuthenticated();
    const authHeader = useAuthHeader();
    const dispatch = useDispatch();

    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<Activity>();
    const [eventLecturer, setEventLecturer] = useState<String>();
    const [isModalOpen, setIsModalOpen] = useState(false);



    const openModal = (info : any) => {
        setEventLecturer(info.event.extendedProps.lecturer);
        setIsModalOpen(true);
      };
    
      // Funkce pro zavření modálního okna
      const closeModal = () => {
        setIsModalOpen(false);
      };

    useEffect(() => {
        getActivities();
    }, [isAuthenticated()]);

    const getActivities = () => {
        if (isAuthenticated()) {
            if (auth()!.role === "student") {
                fetchActivitiesStudent();
            }
            else if (auth()!.role === "vyučující") {
                fetchActivitiesTeacher();
            }
            else if (auth()!.role === "garant") {
                fetchActivitiesGarant();
            }
        }
    };

    async function fetchActivitiesStudent() {
        fetchActivities(import.meta.env.VITE_SERVER_HOST + `registrations/instances/${auth() ? auth()!.id : ``}`);
    }

    async function fetchActivitiesTeacher() {
        fetchActivities(import.meta.env.VITE_SERVER_HOST + "courses/instances?lecturer=" + auth()!.id);
    }

    async function fetchActivitiesGarant() {
        fetchActivities(import.meta.env.VITE_SERVER_HOST + "courses/instances?lecturer=" + auth()!.id);
    }



    async function fetchActivities(URL: string) {
        try {
            dispatch(setLoadingContentState(true));
            const response = await fetch(URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: authHeader(),
                },
            });
            const json_activities = await response.json();
            setActivities(json_activities)
            dispatch(setLoadingContentState(false));
        }
        catch (err) {
            dispatch(setLoadingContentState(false));
        }
    }

    const generateRandomColor = (lightness = 60, id : string) => {
        let storedColor = (localStorage.getItem(id));

        if (storedColor) {
            // Pokud je k dispozici ulozena barva return
            return storedColor;
        }
        const letters = '0123456789ABCDEF';
        let color = '#';
        
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
      
        const limitedLightness = Math.min(100, Math.max(40, lightness));
      
        const rgb = [
          parseInt(color.slice(1, 3), 16),
          parseInt(color.slice(3, 5), 16),
          parseInt(color.slice(5, 7), 16)
        ];
      
        const adjustedRgb = rgb.map(value => Math.round(value * (limitedLightness / 100)));
        
        color = `#${adjustedRgb.map(value => value.toString(16).padStart(2, '0')).join('')}`;

        localStorage.setItem(id, color);

      
        return color;
      };
      

    const handleActivityClick = (activity: Activity) => {
        setSelectedActivity(activity);
    };

    const StyleWrapper = styled.div`
    .fc-button.fc-prev-button, .fc-button.fc-next-button, .fc-button.fc-button-primary{
        background: rgba(106,90,205,1);
        background-image: none;
    }
    .fc th {
        background: rgba(106,90,205,1);
    }
    
    .fc td:nth-child(1) {  
      }
    `

    const dayMap: Record<string, number> = {
        pondělí: 1,
        úterý: 2,
        středa: 3,
        čtvrtek: 4,
        pátek: 5,
      };
 
    const subjects = activities.map(activity => {
        return {
            title: activity.course,
            borderColor: "white",
            backgroundColor: generateRandomColor(90, activity.id),
            daysOfWeek: [dayMap[activity.day]],
            startTime: activity.start_time,
            endTime: calculateEndTime(activity.start_time, activity.duration),
            extendedProps: {
                id: activity.id,
                room: activity.room,
                lecturer: activity.lecturer,          
              },
        };
    });

    function calculateEndTime(startTime: any, duration: any) {
        // Rozdělení začátečního času na hodiny, minuty a sekundy
        const [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);
      
        // Rozdělení délky na hodiny, minuty a sekundy
        const [durationHours, durationMinutes, durationSeconds] = duration.split(':').map(Number);
      
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
        const formattedEndTime = `${padZero(endHours)}:${padZero(endMinutes)}:${padZero(endSeconds)}`;
      
        return formattedEndTime;
      }
      
      // Pomocná funkce pro přidání nuly před jednociferné číslo
      function padZero(num: any) {
        return num < 10 ? `0${num}` : `${num}`;
      }

      //návratová
    const ReturnPage = (props: ReturnPageProps) => {
        return (
            <div className="schedule">
              <StyleWrapper>
                <Fullcalendar
                  events={subjects}
                  locale={csLocale}
                  weekends={false} 
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  headerToolbar={{
                    start: "prev, next",
                    center: "title",
                    end: "dayGridMonth, timeGridWeek, timeGridDay"
                  }}
                  eventMouseEnter={openModal}
                  eventMouseLeave={closeModal}
                  eventContent={renderEventContent}
                  initialView={"timeGridWeek"}
                />
              </StyleWrapper>
        
              {isModalOpen && (
                <div className="modal">
                  <p>Vyučující: {eventLecturer}</p>
                </div>
              )}
            </div>
          );
    };

    function renderEventContent(eventInfo : any) {
        return (
          <div className="lectureEvent">
            <b>{eventInfo.timeText}</b><br/>
            <b>{eventInfo.event.extendedProps.id}</b><br/>
            <b>{eventInfo.event.title}</b><br/>
            <b>{eventInfo.event.extendedProps.room}</b>
          </div>
        )
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
            return (
                <AdminPage />
            );
        } else {
            return <></>;
        }
    } else {
        return <></>;
    }
}

export default SchedulePage;