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
import { Calendar } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';



// "id": 1,
//     "course": "ITU",
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
      id: '1',
      course: 'ITU',
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
        id: '2',
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
        id: '3',
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
  

const SchedulePage = () => {

    const auth = useAuthUser();
    const isAuthenticated = useIsAuthenticated();
    const authHeader = useAuthHeader();
    const dispatch = useDispatch();

    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<Activity>();


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

    type ReturnPageProps = {
        headerName: string;
        errorMessage: string;
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

    const subjects = activitiesDummy.map(activity => {
        return {
        title: activity.course,
        groupId: 'blueEvents', // Přizpůsobte podle potřeby
        daysOfWeek: [dayMap[activity.day]],
        startTime: activity.start_time,
        endTime: calculateEndTime(activity.start_time, activity.duration), // Přizpůsobte podle potřeby
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

    const ReturnPage = (props: ReturnPageProps) => {
            return (
                <div>
                    <div className="course-page">
                        <div className="list-pages-list-container">
                            <h2>{props.headerName}</h2>
                        </div>
                        {props.errorMessage}
                    </div>
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
                            initialView={"timeGridWeek"}/>
                        </StyleWrapper>
                    </div>
                </div>
            );
    };

    type activityDetailProps = {
        selectedActivity: Activity;
    };

    const ActivityDetail = (props: activityDetailProps) => {
        return (
            <div className="user-detail-container">
                <div className="purple-bar"></div>
                <div className="user-detail-properties">
                    <p>Předmět:</p>
                    <p>{props.selectedActivity.course}</p>
                    <p>Typ:</p>
                    <p>{props.selectedActivity.type}</p>
                    <p>Rekurence:</p>
                    <p>{props.selectedActivity.recurrence}</p>
                    <p>Den:</p>
                    <p>{props.selectedActivity.day}</p>
                    <p>Čas:</p>
                    <p>{props.selectedActivity.start_time}</p>
                    <p>Trvání:</p>
                    <p>{props.selectedActivity.duration}</p>
                    <p>Místnost:</p>
                    <p>{props.selectedActivity.room}</p>
                    <p>Učitel:</p>
                    <p>{props.selectedActivity.lecturer}</p>
                </div>
            </div>
        );
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