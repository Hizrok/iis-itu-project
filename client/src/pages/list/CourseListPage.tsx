import { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import { useDispatch } from "react-redux";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import CourseList from "../../components/lists/courseListComponent";
import Course from "../../components/common/Types/Course";
import Filter from "../../components/common/Filters/filter";
import User from "../../components/common/Types/User";
import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel, MenuItem, Select, TextField } from "@mui/material";

const CourseListPage = () => {
  const authHeader = useAuthHeader();
  const dispatch = useDispatch();

  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);

  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [garant, setGarant] = useState<string>("");
  const [annotation, setAnnotation] = useState<string>("");

  const [users, setUsers] = useState<User[]>([]);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [createDialog, setCreateDialog] = useState<boolean>(false);

  // let courses = "loading..."

  useEffect(() => {
    fetchCourses();
    fetchUsers();
  }, []);

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
    setFilteredCourses(json_courses);
    dispatch(setLoadingContentState(false));
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

  const sortCourses = (courses: Course[], sortBy: string, descending: boolean) => {
    return courses.slice().sort((a: any, b: any) => {
      const order = descending ? -1 : 1;
      return a[sortBy].localeCompare(b[sortBy]) * order;
    });
  };

  const filterCourses = (filterType: string, isDescending: boolean) => {
    setFilteredCourses(sortCourses(courses, filterType, isDescending));
  }

  async function createCourses() {

    const new_course = {
      id: id,
      name: name,
      annotation: annotation,
      guarantor: garant,
    };

    try {
      dispatch(setLoadingContentState(true));
      const request = await fetch("http://localhost:3000/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": authHeader()
        },
        body: JSON.stringify(new_course),
      });
      const request_json = await request.json();
      console.log(request_json);
      console.log(JSON.stringify(new_course));
      dispatch(setLoadingContentState(false));
      fetchCourses();
    }
    catch (err) {
      setErrorMessage("Error during creation!");
      dispatch(setLoadingContentState(false));
    }
  }

  if (courses.length !== 0) {
    return (
      <>
        <div className="course-page">
          <div className="list-pages-list-container">
            <h2>Seznam Předmětů <AddIcon sx={{ border: 1 }} onClick={() => setCreateDialog(true)} /></h2>
          </div>
          <Filter onFilterChange={filterCourses} />
          <CourseList courses={filteredCourses} />
        </div>
        <Dialog
          open={createDialog}
          onClose={() => {
            setCreateDialog(false);
          }}>
          <DialogTitle>Vytvořit Uživatele</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              type="text"
              fullWidth
              variant="outlined"
              label="Zkratka předmětu"
              onChange={(e) => setId(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              type="text"
              fullWidth
              label="Jméno předmětu"
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="dense"
              type="text"
              fullWidth
              label="Anotace předmětu"
              variant="outlined"
              onChange={(e) => setAnnotation(e.target.value)}
            />
            <InputLabel id="select-label">Garant</InputLabel>
            <Select
              margin="dense"
              type="text"
              fullWidth
              variant="standard"
              labelId="select-label"
              value={garant}
              onChange={(e) => {
                setGarant(e.target.value);
              }}
            >
              {users.map((user: User) => (
                user.role === "garant" ?
                  <MenuItem value={user.id}>{user.id}</MenuItem>
                  :
                  null
              ))}
            </Select>
          </DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
          <DialogActions>
            <Button
              onClick={() => {
                setCreateDialog(false);
              }}>
              Zrušit
            </Button>
            <Button onClick={createCourses}>Vytvořit</Button>
          </DialogActions>
        </Dialog>
      </>

    );
  }
  else {
    return (<></>);
  }
}

export default CourseListPage;