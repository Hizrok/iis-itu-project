import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useAuthHeader } from "react-auth-kit";

type CreateCourseDialogProps = {
  showDialog: boolean;
  guarantors: string[];
  toggleDialog: Function;
  createCourse: Function;
  setCourses: Function;
};

const CreateCourseDialog = ({
  showDialog,
  guarantors,
  toggleDialog,
  createCourse,
  setCourses,
}: CreateCourseDialogProps) => {
  const [disabled, setDisabled] = useState(false);
  const authHeader = useAuthHeader();

  const [abbr, setAbbr] = useState("");
  const [name, setName] = useState("");
  const [annotation, setAnnotation] = useState("");
  const [guarantor, setGuarantor] = useState("");

  const handleCreateCourse = () => {
    setDisabled(true);
    createCourse(abbr, name, annotation, guarantor, setCourses, authHeader);
    setDisabled(false);
    toggleDialog(false);

    setAbbr("");
    setName("");
    setAnnotation("");
    setGuarantor("");
  };

  return (
    <Dialog open={showDialog} onClose={() => toggleDialog(false)}>
      <DialogTitle>Vytvořit předmět</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => toggleDialog(false)}
          disabled={disabled}
        >
          Zrušit
        </Button>
        <Button
          variant="outlined"
          onClick={handleCreateCourse}
          disabled={disabled}
        >
          Vytvořit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCourseDialog;
