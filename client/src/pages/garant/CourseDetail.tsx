import { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";

import {
  CircularProgress,
  InputLabel,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import ActivityList from "./ActivityList";
import { useConfirm } from "material-ui-confirm";
import { toast } from "react-toastify";

type CourseDetailProps = {
  id: string;
  editCourse: Function;
  deleteCourse: Function;
  resetSelected: Function;
  setCourses: Function;
  setSelected: Function;
  index: number;
};

const CourseDetail = ({
  id,
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

  const handleEdit = async () => {
    setDisabled(true);
    await toast.promise(
      editCourse(abbr, name, annotation, guarantor, index, setCourses, setSelected, authHeader),
      {
        pending: 'Předmět se aktualizuje',
        success: 'Předmět aktualizulován',
        error: 'Problém s tvorbou předmětu'
      }
    );
    
    setDisabled(false);
  };

  const handleDelete = async () => {
    confirm({ description: "Chcete smazat předmět?", confirmationText: "Ano", cancellationText: "Ne", title: "Smazání předmětu", confirmationButtonProps: { color: "error" }  })
      .then(async () => {
        setDisabled(true);
        await toast.promise(
          deleteCourse(id, resetSelected, authHeader),
          {
            pending: 'Předmět se maže',
            success: 'Předmět smazán',
            error: 'Problém s mazáním předmětu'
          }
        );
        setDisabled(false);
      })
      .catch(() => {
      });
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
            <Autocomplete
              disabled
              value={guarantor}
              onChange={(event: any, newValue: string | null) => {
                console.log(event);
                setGuarantor(newValue? newValue : guarantor);
              }}
              id="controllable-states-type"
              options={[guarantor]}
              fullWidth
              renderInput={(params) => <TextField {...params} />}
              />
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
