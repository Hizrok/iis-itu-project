import { useAuthHeader, useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

type Activity = {
    id: string;
    name: string;
    guarantor: string;
  };
  

const SchedulePage = () => {

    const auth = useAuthUser();
    const isAuthenticated = useIsAuthenticated();
    const authHeader = useAuthHeader();
    const dispatch = useDispatch();

    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        getActivities();
    }, [isAuthenticated()]);

    const getActivities = () => {
        if(isAuthenticated()){
            if(auth()!.role === "student"){
                fetchActivitiesStudent();
            }
            else if(auth()!.role === "vyučující" ){
                fetchActivitiesTeacher();
            }
            else if(auth()!.role === "garant"){
                fetchActivitiesGarant();
            }
        }
    };

    async function fetchActivitiesStudent() {
        fetchActivities(import.meta.env.VITE_SERVER_HOST+`registrations/instances/${auth()?auth()!.id:``}`);
    }

    async function fetchActivitiesTeacher() {
        fetchActivities(import.meta.env.VITE_SERVER_HOST+"courses/instances?lecturer="+auth()!.id);
    }

    async function fetchActivitiesGarant() {
        fetchActivities(import.meta.env.VITE_SERVER_HOST+"courses/instances?lecturer="+auth()!.id);
    }



    async function fetchActivities(URL: string) {
        try{
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
        catch(err){
            dispatch(setLoadingContentState(false));
        }
    }

    type RetrurnPageProps = {
        headerName: string;
        errorMessage: string;
    };
    
    const ReturnPage = (props: RetrurnPageProps) => {
        if (activities.length !== 0) {
            return (
            <div className="course-page">
                <div className="list-pages-list-container">
                <h2>{props.headerName}</h2>
                </div>
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

    const AdminPage = () => {
        return(
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
        }else {
            return <></>;
        }
    } else {
    return <></>;
    }
}

export default SchedulePage;