import { useState, useEffect } from "react";
import "../../styles/style.css";
import { useAuthHeader } from "react-auth-kit";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useDispatch } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Room from "../../components/common/Types/Room";
import User from "../../components/common/Types/User";


type Instance = {
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
}

type Course = {
  id: string;
  name: string;
  guarantor: string;
};

type Activity = {
  id: string;
  type: string;
  guarantor: string;
};


const ActivityListPage = () => {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
  
  const [users, setUsers] = useState<User[]>([]);  
  const [courses, setCourses] = useState<Course[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [id, setID] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  //const [type, setType] = useState<string>("");
  //const [reccurence, setReccurence] = useState<string>("");
  //const [capacity, setCapacity] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [start_time, setStart_Time] = useState<string>("");
  //const [duration, setDuration] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [lecutrer, setLecturer] = useState<string>("");

  const authHeader = useAuthHeader();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [createDialog, setCreateDialog] = useState<boolean>(false);

  useEffect(() => {
    fetchInstances();
    fetchCourses();
    fetchRooms();
    fetchUsers();
  }, []);

  useEffect(() =>{
    fetchActivities();
  }, [course]);

  async function fetchUsers() {
    try {
      dispatch(setLoadingContentState(true));
      const response = await fetch(import.meta.env.VITE_SERVER_HOST+"users", {
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

  async function fetchRooms() {
    try {
        dispatch(setLoadingContentState(true));
        const response = await fetch(import.meta.env.VITE_SERVER_HOST+"rooms", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: authHeader(),
        },
        });
        const json_users = await response.json();
        setRooms(json_users.filter((room: Room) => room.id !== null));
        dispatch(setLoadingContentState(false));
    } catch (error) {
        console.error("Error fetching users:", error);
        dispatch(setLoadingContentState(false));
    }
  }

  async function fetchCourses() {
    dispatch(setLoadingContentState(true));
    const response = await fetch(import.meta.env.VITE_SERVER_HOST+"courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authHeader(),
        },
      });
      const json_courses = await response.json();

    setCourses(json_courses);
    dispatch(setLoadingContentState(false));
  }

  async function fetchActivities() {
    dispatch(setLoadingContentState(true));
    try{
      const response = await fetch(import.meta.env.VITE_SERVER_HOST+`courses/${course}/activities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authHeader(),
        },
      });
      const json_activities = await response.json();
      if(response.status > 400){
        setActivities([]);
      }
      else{
        setActivities(json_activities);
      }
      dispatch(setLoadingContentState(false));
    }
    catch(err){
      dispatch(setLoadingContentState(false));
    }
  }

  async function fetchInstances() {
    dispatch(setLoadingContentState(true));
    try{
      const response = await fetch(import.meta.env.VITE_SERVER_HOST+`courses/instances`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authHeader(),
        },
      });
      const json_instances = await response.json();
      if(response.status > 400){
        setInstances([]);
      }
      else{
        setInstances(json_instances);
      }
      dispatch(setLoadingContentState(false));
    }
    catch(err){
      dispatch(setLoadingContentState(false));
    }
  }

  const handleInstanceClick = (instance: Instance) => {
    setSelectedInstance(instance);
    console.log(selectedInstance?.id);
  };

  async function createInstance() {

    const new_instance = {
      day: day,
      start_time: start_time,
      room: room,
      lecturer: lecutrer
    }
    try {
      dispatch(setLoadingContentState(true));
      await fetch(import.meta.env.VITE_SERVER_HOST+`courses/${course}/activities/${id}/instances/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": authHeader()
        },
        body: JSON.stringify(new_instance) 
      })
      setCreateDialog(false);
      dispatch(setLoadingContentState(false));
    }
    catch(err){
      setErrorMessage("Error creating instance");
      dispatch(setLoadingContentState(false));
    }
  }

  /*const handleDeleteInstance = (toBeDeletedInstance: Instance) => {  
    const deleteUser = async () => {
      try { 
        dispatch(setLoadingContentState(true));
        await fetch(
          import.meta.env.VITE_SERVER_HOST+`${selectedInstance!.course}/activities/${selectedInstance!.}/instances/${selectedInstance!.id}`,
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
  }*/

  /*const handleEditActivity = (editedActivity: Activity) => {  
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
          import.meta.env.VITE_SERVER_HOST+`${selectedInstance!.course}/activities/${selectedInstance!.}/instances/${selectedInstance!.id`,
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
  };*/

  return (
    <>
        <div className="list-pages-list-container">
          <h2>Seznam Instancí <AddIcon sx={{border:1}} onClick= {() => setCreateDialog(true)}/></h2>
          <ul>
          <li className="list-header">
            <span className="header-item">Předmět</span>
            <span className="header-item">Typ</span>
            <span className="header-item">Rekurence</span>
            <span className="header-item">Kapacita</span>
            <span className="header-item">Den</span>
            <span className="header-item">Začátek</span>
            <span className="header-item">Trvání</span>
            <span className="header-item">Místnost</span>
            <span className="header-item">Vyučuje</span>
          </li>
            {instances.map((instance: Instance) => (
              <li
              key={instance.id}
              className="list-item-properties"
              onClick={() => handleInstanceClick(instance)}
              >
              <span className="list-item-property">{instance.course}</span>
              <span className="list-item-property">{instance.type}</span>
              <span className="list-item-property">{instance.recurrence}</span>
              <span className="list-item-property">{instance.capacity}</span>
              <span className="list-item-property">{instance.day}</span>
              <span className="list-item-property">{instance.start_time}</span>
              <span className="list-item-property">{instance.duration}</span>
              <span className="list-item-property">{instance.room}</span>
              <span className="list-item-property">{instance.lecturer}</span>
              </li>
            ))}
          </ul>
        </div>
      
      <Dialog
        open={createDialog}
        onClose={() => {
          setCreateDialog(false);
        }}>
        <DialogTitle>Vytvořit Instanci</DialogTitle>
        <DialogContent>
          <InputLabel id="select-label">Předmět</InputLabel>
          <Select
            sx={{ m: 1, width: "25ch" }}
            labelId="select-label"
            value={course}
            onChange={(e) => {
              setCourse(e.target.value);
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
            value={id}
            onChange={(e) => {
              setID(e.target.value);
            }}
          >
            {activities.map((activity: Activity) => (
              <MenuItem value={activity.id}>{activity.type}</MenuItem>
            ))}
          </Select>
          <InputLabel id="select-label">Den</InputLabel>
          <Select
            sx={{ m: 1, width: "25ch" }}
            labelId="select-label"
            value={day}
            onChange={(e) => {
              setDay(e.target.value);
            }}
          >
            <MenuItem value="pondělí">pondělí</MenuItem>
            <MenuItem value="úterý">úterý</MenuItem>
            <MenuItem value="středa">středa</MenuItem>
            <MenuItem value="čtvrtek">čtvrtek</MenuItem>
            <MenuItem value="pátek">pátek</MenuItem>
          </Select>
          <InputLabel id="select-label">Místnost</InputLabel>
          <Select
            sx={{ m: 1, width: "25ch" }}
            labelId="select-label"
            value={room}
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          >
            {rooms.map((room: Room) => (
              <MenuItem value={room.id}>{room.id}</MenuItem>
            ))}
          </Select>
          <InputLabel id="select-label">Vučující</InputLabel>
          <Select
            sx={{ m: 1, width: "25ch" }}
            labelId="select-label"
            value={lecutrer}
            onChange={(e) => {
              setLecturer(e.target.value);
            }}
          >
            {users.map((user: User) => (
              user.role === "vyučující" || user.role === "garant"? <MenuItem value={user.id}>{user.id}</MenuItem>: null
            ))}
          </Select>
          <TextField
            margin="dense"
            type="text"
            fullWidth
            variant="outlined"
            label="Starttime - hh:mm"
            sx={{ m: 1, width: "25ch" }}
            onChange={(e) => setStart_Time(e.target.value)}
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
            onClick={createInstance}
          >
            Vytvořit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActivityListPage;

