import { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";

import {
  CircularProgress,
  InputLabel,
  TextField,
  Autocomplete,
} from "@mui/material";
import ActivityList from "./ActivityList";

type CourseDetailProps = {
  id: string;
  guarantors: string[];
  setCourses: Function;
  setSelected: Function;
  index: number;
};

const CourseDetail = ({
  id,
  guarantors,
}: CourseDetailProps) => {
  const authHeader = useAuthHeader();

  const [loading, setLoading] = useState(false);

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
            <TextField
              margin="dense"
              label="Zkratka"
              disabled
              fullWidth
              variant="outlined"
              value={abbr}
              onChange={(e) => setAbbr(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Jméno"
              disabled
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Anotace"
              disabled
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
              options={guarantors}
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
