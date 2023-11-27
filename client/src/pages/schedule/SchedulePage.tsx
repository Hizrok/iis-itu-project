import { useAuthHeader, useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import "../../styles/style.css";




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

    const ReturnPage = (props: ReturnPageProps) => {
        if (activities.length !== 0) {
            return (
                <div className="activity-page">
                    <div className="list-pages-list-container">
                        <h2>{props.headerName}</h2>
                        <li className="list-header">
                            <span className="header-item">Předmět</span>
                            <span className="header-item">Typ</span>
                            <span className="header-item">Den</span>
                            <span className="header-item">Čas</span>
                            <span className="header-item">Místnost</span>
                        </li>
                        {activities.map((activity: Activity) => (
                            <li
                                key={activity.id}
                                className="list-item-properties"
                                onClick={() => handleActivityClick(activity)}
                            >
                                <span className="list-item-property">{activity.course}</span>
                                <span className="list-item-property">{activity.type}</span>
                                <span className="list-item-property">{activity.day}</span>
                                <span className="list-item-property">{activity.start_time}</span>
                                <span className="list-item-property">{activity.room}</span>
                            </li>
                        ))}
                    </div>
                    {selectedActivity && (
                        <ActivityDetail
                            selectedActivity={selectedActivity}
                        ></ActivityDetail>
                    )}
                </div>
            );
        } else {
            return (
                <div className="course-page">
                    <div className="list-pages-list-container">
                        <h2>{props.headerName}</h2>
                    </div>
                    {props.errorMessage}
                </div>
            );
        }
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