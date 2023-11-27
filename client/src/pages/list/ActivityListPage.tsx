import { useState, useEffect } from "react";
import "../../styles/style.css";
import { useAuthHeader } from "react-auth-kit";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useDispatch } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Course from "../../components/common/Types/Course";
import Activity from "../../components/common/Types/Activity";
import ActivityDetail from "./ActivityListComponents/ActivityDetail";

const ActivityListPage = () => {
  const [selectedCourseID, setSelectedCourseID] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  

  const [courseID, setCourseID] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [recurrence, setRecurrence] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  const authHeader = useAuthHeader();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [createDialog, setCreateDialog] = useState<boolean>(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if(selectedCourseID != undefined || selectedCourseID != "s"){
      fetchActivities();
    }
  }, [selectedCourseID])

  async function fetchCourses() {
    dispatch(setLoadingContentState(true));
    const response = await fetch("http://localhost:3000/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authHeader(),
        },
      });
      const json_courses = await response.json();

    setCourses(json_courses);
    setSelectedCourseID(json_courses[0].id)
    dispatch(setLoadingContentState(false));
  }

  async function fetchActivities() {
    console.log(selectedCourseID);
    dispatch(setLoadingContentState(true));
    try{
      const response = await fetch(`http://localhost:3000/courses/${selectedCourseID}/activities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authHeader(),
        },
      });
      const json_courses = await response.json();
      if(response.status > 400){
        setActivities([]);
        setSelectedActivity(null);
      }
      else{
        setActivities(json_courses);
        setSelectedActivity(null);
      }
      dispatch(setLoadingContentState(false));
    }
    catch(err){
      dispatch(setLoadingContentState(false));
    }
  }

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    };

  async function createActivity() {

    const new_activity = {
      type: type,
      recurrence: recurrence,
      capacity: capacity,
      duration: duration,
    };
    try {
      dispatch(setLoadingContentState(true));
      await fetch("http://localhost:3000/courses/"+courseID, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": authHeader()
        },
        body: JSON.stringify(new_activity) 
    })
    setCreateDialog(false);
    fetchActivities();
    dispatch(setLoadingContentState(false));
    }
    catch(err){
      console.error("Error updating user:", err);
      dispatch(setLoadingContentState(false));
    }
  }

  const handleDeleteActivity = (toBeDeletedActivity: Activity) => {  
    const deleteUser = async () => {
      try {
        dispatch(setLoadingContentState(true));
        await fetch(
          `http://localhost:3000/${selectedCourseID}/activities/${toBeDeletedActivity.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              authorization: authHeader(),
            },
          }
        );
        fetchActivities();
        dispatch(setLoadingContentState(false));
      } catch (error) {
        dispatch(setLoadingContentState(false));
        setErrorMessage("Error during creating!");
      }
    };
    deleteUser();
  }

  const handleEditActivity = (editedActivity: Activity) => {  
    const toBeUpdatedActivity = {
      type: editedActivity.type,
      recurrence: editedActivity.recurrence,
      duration: editedActivity.duration,
      capacity: editedActivity.capacity
    };
  
    const updateActivity = async () => {
      try {
        dispatch(setLoadingContentState(true));
        await fetch(
          `http://localhost:3000/${selectedCourseID}/activities/${editedActivity.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: authHeader(),
            },
            body: JSON.stringify(toBeUpdatedActivity),
          }
        );
  
        // call fetch users after update user
        fetchActivities();
        dispatch(setLoadingContentState(false));
      } catch (error) {
        console.error("Error updating user:", error);
        dispatch(setLoadingContentState(false));
      }
    };
  
    updateActivity();
  };

  return (
    <>
      <InputLabel id="select-label">Vybrat Předmět</InputLabel>
          <Select
            sx={{ m: 1, width: "25ch" }}
            labelId="select-label"
            value={selectedCourseID}
            onChange={(e) => {
              setSelectedCourseID(e.target.value);
            }}>
            {courses.map((course: Course) => (
              <MenuItem value={course.id}>{course.id}</MenuItem>
            ))}
          </Select>
      <div className="users-page">
        <div className="list-pages-list-container">
          <h2>Seznam Aktivit <AddIcon sx={{border:1}} onClick= {() => setCreateDialog(true)}/></h2>
          <ul>
          <li className="list-header">
            <span className="header-item">Typ</span>
            <span className="header-item">Délka</span>
            <span className="header-item">Rekurence</span>
            <span className="header-item">Kapacita</span>
          </li>
            {activities.map((activity: Activity) => (
              <li
              key={activity.id}
              className="list-item-properties"
              onClick={() => handleActivityClick(activity)}
              >
              <span className="list-item-property">{activity.type}</span>
              <span className="list-item-property">{activity.duration}</span>
              <span className="list-item-property user-role">{activity.recurrence}</span>
              <span className="list-item-property user-role">{activity.capacity}</span>
              </li>
            ))}
          </ul>
        </div>
        {selectedActivity && (
          <ActivityDetail
          selectedActivity={selectedActivity}
          onEditActivity={handleEditActivity}
          onDeleteActivity={handleDeleteActivity}
          ></ActivityDetail>
        )}
      </div>
      
      <Dialog
        open={createDialog}
        onClose={() => {
          setCreateDialog(false);
        }}>
        <DialogTitle>Vytvořit Uživatele</DialogTitle>
        <DialogContent>
          <InputLabel id="select-label">Předmět</InputLabel>
          <Select
            sx={{ m: 1, width: "25ch" }}
            labelId="select-label"
            value={courseID}
            onChange={(e) => {
              setCourseID(e.target.value);
            }}
          >
            {courses.map((course: Course) => (
              <MenuItem value={course.id}>{course.id}</MenuItem>
            ))}
          </Select>
          <InputLabel id="select-label">Typ</InputLabel>
          <Select
            sx={{ m: 1, width: "25ch" }}
            labelId="select-label"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <MenuItem value="přednáška">přednáška</MenuItem>
            <MenuItem value="cvičení">cvičení</MenuItem>
            <MenuItem value="laboratoř">laboratoř</MenuItem>
            <MenuItem value="democvičení">democvičení</MenuItem>
            <MenuItem value="seminář">seminář</MenuItem>
          </Select>
          <InputLabel id="select-label">Rekurence</InputLabel>
          <Select
            sx={{ m: 1, width: "25ch" }}
            labelId="select-label"
            value={recurrence}
            onChange={(e) => {
              setRecurrence(e.target.value);
            }}
          >
            <MenuItem value="každý">každý</MenuItem>
            <MenuItem value="lichý">lichý</MenuItem>
            <MenuItem value="sudý">sudý</MenuItem>
            <MenuItem value="jednorázová aktivita">jednorázová aktivita</MenuItem>
          </Select>
          <TextField
            autoFocus
            margin="dense"
            type="text"
            fullWidth
            variant="outlined"
            label="Kapacita"
            sx={{ m: 1, width: "25ch" }}
            onChange={(e) => setCapacity(e.target.value)}
          />
          <TextField
            margin="dense"
            type="text"
            fullWidth
            variant="outlined"
            label="Duration - hh:mm"
            sx={{ m: 1, width: "25ch" }}
            onChange={(e) => setDuration(e.target.value)}
          />
          
        <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setCreateDialog(false);
            }}>
            Zrušit
          </Button>
          <Button
            variant="outlined"
            onClick={createActivity}
          >
            Vytvořit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActivityListPage;

