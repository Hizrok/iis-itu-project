import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useParams } from "react-router-dom";
import { Fab, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import Course from "../../components/common/Types/Course";
import Activity from "../../components/common/Types/Activity";
import User from "../../components/common/Types/User";

const CourseDetailsPage = () => {
    const params = useParams()

    const auth = useAuthUser();
    const dispatch = useDispatch();
    const authHeader = useAuthHeader();

    const [course, setCourse] = useState<Course>();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [oldID, setOldID] = useState<string>("");
    const [id, setID] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [garant, setGarant] = useState<string>("");
    const [annotation, setAnnotation] = useState<string>("");

    async function fetchCourse() {
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

            setID(course_json? course_json.id:"");
            setName(course_json? course_json.name:"");
            setGarant(course_json? course_json.guarantor.id:"");
            setAnnotation(course_json? course_json.annotation:"");
            setActivities(course_json? course_json.activities: []);

            
            dispatch(setLoadingContentState(false));
        }
        catch(err){
            console.log(err);
            dispatch(setLoadingContentState(false));
        }
        
    }

    async function fetchUsers() {
        try {
          dispatch(setLoadingContentState(true));
          const response = await fetch("http://localhost:3000/users", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: authHeader(),
            },
          });
          const json_users = await response.json();
          setUsers(json_users.filter((user: User) => user.name !== null));
          dispatch(setLoadingContentState(false));
        } catch (error) {
          dispatch(setLoadingContentState(false));
          console.error("Error fetching users:", error);
        }
      }
    

    useEffect(() => {
        fetchCourse();
    }, [params]);

    function handleEdit(bool: boolean){
        setIsEditing(bool);
        setOldID(id);
        if(bool){
            fetchUsers();
        }
    }

    const updateCourseHandle = () => {
        const toBeUpdatedCourse = {
            id: id,
            name: name,
            annotation: annotation,
            guarantor: garant,
        };
    
        const updateCourse = async () => {
            try {
            dispatch(setLoadingContentState(true));
            await fetch(
                "http://localhost:3000/courses/" + oldID,
                {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    authorization: authHeader(),
                },
                body: JSON.stringify(toBeUpdatedCourse),
                }
            );
    
            // call fetch rooms after update room
            fetchCourse();
            dispatch(setLoadingContentState(false));
            setIsEditing(false);
            } catch (error) {
            console.error("Error updating room:", error);
            dispatch(setLoadingContentState(false));
            }
        };
    
        updateCourse();
    };


    if(isEditing){
        return (
            <>
                {isEditing && ((auth()? auth()!.role : null) === "admin"  || (auth()? auth()!.role : null) === "garant")?
                    <Fab variant="extended"
                    onClick= {() => handleEdit(false)}
                    sx={{ maxHeight: 35, maxWidth: 300, marginBottom:5 }}>
                    Stop Editting
                    </Fab>
                    :
                    <></>                  
                }
                <Typography variant='h6'>Detaily Předmětu</Typography>
                    <Stack
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
                        onChange={(e) => setID(e.target.value)} />
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
                        label="Annotace"
                        value={annotation}
                        variant="filled"
                        multiline
                        sx={{
                            margin: 100,
                            minWidth:500}}
                        onChange={(e) => setAnnotation(e.target.value)} />
                    <InputLabel id="select-label">Garant</InputLabel>
                    <Select
                        sx={{ m: 1, width: "25ch" }}
                        labelId="select-label"
                        value={garant}
                        onChange={(e) => {
                        setGarant(e.target.value);
                        }}
                    >
                        {users.map((user: User) => (
                        user.role === "garant"?
                        <MenuItem value={user.id}>{user.id}</MenuItem>
                        :
                        null
                        ))}
                    </Select>
                    <Fab variant="extended"
                        onClick={updateCourseHandle}
                        sx={{ maxHeight: 35, maxWidth: 300 }}>
                        Uložit změny
                    </Fab>
                    <div className="activites-page">
                        <div className="list-pages-list-container">
                            <h2>Seznam Aktivit</h2>
                            <ul>
                            <li className="list-header">
                                <span className="header-item">Typ</span>
                                <span className="header-item">Délka</span>
                                <span className="header-item">Rekurence</span>
                            </li>
                            {activities.map((activity: Activity) => (
                                <li
                                key={activity.id}
                                className="list-item-properties"
                                >
                                <span className="list-item-property">{activity.type}</span>
                                <span className="list-item-property">{activity.duration}</span>
                                <span className="list-item-property user-role">{activity.recurrence}</span>
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
                </Stack>
            </>
        );
    }
    else if(course){
        return(
            <>
                {!isEditing && ((auth()? auth()!.role : null) === "admin"  || (auth()? auth()!.role : null) === "garant")?
                    <Fab variant="extended"
                    onClick= {() => handleEdit(true)}
                    sx={{ maxHeight: 35, maxWidth: 300, marginBottom:5 }}>
                    Edit
                    </Fab>
                    :
                    <></>
                }
                <Stack spacing={2}>
                    <Typography variant='h6'>{course?.name} ({course?.id})</Typography>
                    <Typography>Garant: {course?.guarantor.id}</Typography>
                    <Typography>Anotace: {course?.annotation}</Typography>
                </Stack>
                <div className="activites-page">
                    <div className="list-pages-list-container">
                        <h2>Seznam Uživatelů</h2>
                        <ul>
                        <li className="list-header">
                            <span className="header-item">Typ</span>
                            <span className="header-item">Délka</span>
                            <span className="header-item">Rekurence</span>
                        </li>
                        {activities.map((activity: Activity) => (
                            <li
                            key={activity.id}
                            className="list-item-properties"
                            >
                            <span className="list-item-property">{activity.type}</span>
                            <span className="list-item-property">{activity.duration}</span>
                            <span className="list-item-property user-role">{activity.recurrence}</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            </>
        );
    }
    else{
        return(
            <></>
        );
    }
};

export default CourseDetailsPage;
