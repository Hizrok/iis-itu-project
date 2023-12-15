import { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";

import {
  CircularProgress,
  InputLabel,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import ActivityList from "./ActivityList";
import { useConfirm } from "material-ui-confirm";

type CourseDetailProps = {
  id: string;
  guarantors: string[];
  editCourse: Function;
  deleteCourse: Function;
  resetSelected: Function;
  setCourses: Function;
  setSelected: Function;
  index: number;
};

const CourseDetail = ({
  id,
  guarantors,
  editCourse,
  deleteCourse,
  resetSelected,
  setCourses,
  setSelected,
  index,
}: CourseDetailProps) => {
  const authHeader = useAuthHeader();
  const confirm = useConfirm();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [abbr, setAbbr] = useState("");
  const [name, setName] = useState("");
  const [annotation, setAnnotation] = useState("");
  const [guarantor, setGuarantor] = useState("");

  const getCourse = async () => {
    setLoading(true);
    await axios
      .get(`${import.meta.env.VITE_SERVER_HOST}courses/${id}`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        setAbbr(res.data.id);
        setName(res.data.name);
        setAnnotation(res.data.annotation);
        setGuarantor(res.data.guarantor);
      })
      .catch((err) => console.error(err.message))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEdit = () => {
    setDisabled(true);
    editCourse(abbr, name, annotation, guarantor, index, setCourses, setSelected, authHeader);
    setDisabled(false);
  };

  const handleDelete = () => {
    setDisabled(true);
    deleteCourse(id, resetSelected, confirm, authHeader);
    setDisabled(false);
  };

  useEffect(() => {
    if (id) {
      getCourse();
    }
  }, [id]);

  return (
    <div className="detail">
      {id ? (
        loading ? (
          <div className="loader-container">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <div>
            <div className="detail-buttons">
              <Button
                variant="contained"
                disabled={disabled}
                onClick={handleEdit}
              >
                Save
              </Button>
              <Button
                variant="contained"
                disabled={disabled}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
            <TextField
              margin="dense"
              label="Zkratka"
              disabled={disabled}
              fullWidth
              variant="outlined"
              value={abbr}
              onChange={(e) => setAbbr(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Jméno"
              disabled={disabled}
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Anotace"
              disabled={disabled}
              fullWidth
              variant="outlined"
              value={annotation}
              multiline
              rows={5}
              onChange={(e) => setAnnotation(e.target.value)}
            />
            <InputLabel>Garant</InputLabel>
            <Select
              className="role-select"
              fullWidth
              disabled={disabled}
              value={guarantor}
              onChange={(e) => setGuarantor(e.target.value)}
            >
              {guarantors.map((g: string) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
            <ActivityList course={id} />
          </div>
        )
      ) : (
        <div className="nothing-selected-container">
          <h3>select course</h3>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
