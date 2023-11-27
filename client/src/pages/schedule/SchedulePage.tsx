import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

const SchedulePage = () => {

    const authHeader = useAuthHeader();
    const dispatch = useDispatch();
    const auth = useAuthUser();

    const [errorMessage, setErrorMessage] = useState<string>("");

    async function fetchActivities() {
        try{
            dispatch(setLoadingContentState(true));
            const response = await fetch(import.meta.env.VITE_SERVER_HOST+`registrations/activities/${auth()?auth()!.id:``}`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                authorization: authHeader(),
                },
            });
            if(response.status==404){
                setErrorMessage("Žádné registrované aktivity na tomto účtu")
            }
            const json_courses = await response.json();
            console.log(json_courses);
            dispatch(setLoadingContentState(false));
        }
        catch(err){
            dispatch(setLoadingContentState(false));
        }
        
    
        
    }

    useEffect(() => {
        fetchActivities();
    }, []);


    return(
        <>
            <div>{errorMessage}</div>
            <div>SchedulePage</div>
        </>
    )
}

export default SchedulePage;