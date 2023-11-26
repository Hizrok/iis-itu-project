import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useParams } from "react-router-dom";
import { Fab, Stack, TextField, Typography } from "@mui/material";
import { useAuthUser } from "react-auth-kit";

type User = {
    id: string;
    role: string;
    name: string;
    surname: string;
};

type Course = {
    id: string;
    name: string;
    annotation: string;
    guarantor: User;
};

const CourseDetailsPage = () => {
    const params = useParams()

    const auth = useAuthUser();
    const dispatch = useDispatch();

    const [course, setCourse] = useState<Course>();

    
    const [id, setCourseID] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [garant, setGarant] = useState<string>("");
    const [annotation, setAnnotation] = useState<string>("");

    const updateInfoHandle = () => {
        return;
    };

    async function fetchcourse() {
        dispatch(setLoadingContentState(true));
        try{
        const link = `http://localhost:3000/courses/${params.courseID}`;
            const response = await fetch(link, {
                method: "GET", 
                headers: {
                "Content-Type": "application/json"
                }
            });
            const course_json = await response.json();
        
            setCourse(course_json);

            setCourseID(course_json? course_json.id:"");
            setName(course_json? course_json.name:"");
            setGarant(course_json? course_json.guarantor.id:"");
            setAnnotation(course_json? course_json.annotation:"");

            
            dispatch(setLoadingContentState(false));
        }
        catch(err){
            console.log(err);
            dispatch(setLoadingContentState(false));
        }
        
    }

    useEffect(() => {
        fetchcourse();
    }, [params]);

    if(course && ((auth()? auth()!.role : "test") === "admin" || (auth()? auth()!.role : "test")==="garant")){
        return (
            <><Typography variant='h6' /*alignSelf={"center"}*/>Detaily Předmětu</Typography>
                <Stack
                /*alignItems={"center"}*/
                spacing={2}
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    display: 'flex',
                    flexWrap: 'wrap',
                }}
                noValidate
                autoComplete="off"
                gridColumn={0}
                gridRow={1}
                >
                <TextField
                    id="filled"
                    label="ID"
                    value={id}
                    variant="filled"
                    onChange={(e) => setCourseID(e.target.value)} />
                <TextField
                    required
                    id="filled-required"
                    label="Název"
                    value={name}
                    variant="filled"
                    onChange={(e) => setName(e.target.value)} />
                <TextField
                    required
                    id="filled-required"
                    label="Garant"
                    value={garant}
                    variant="filled"
                    onChange={(e) => setGarant(e.target.value)} />
                <TextField
                    required
                    id="filled-required"
                    label="Annotace"
                    value={annotation}
                    variant="filled"
                    multiline
                    sx={{
                        margin: 100,
                        minWidth:500}}
                    onChange={(e) => setAnnotation(e.target.value)} />
                <Fab variant="extended"
                    onClick={updateInfoHandle}
                    sx={{ maxHeight: 35, maxWidth: 300 }}>
                    Uložit změny
                </Fab>
            </Stack></>
            
        );
  }
  else if(course){
    return(
        <Stack spacing={2}>
            <Typography variant='h6'>{course?.name} ({course?.id})</Typography>
            <Typography>Garant: {course?.guarantor.id}</Typography>
            <Typography>Anotace: {course?.annotation}</Typography>
        </Stack>
    )
  }
  return (
    <></>
  );
  
};

export default CourseDetailsPage;
