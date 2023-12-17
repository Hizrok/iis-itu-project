import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import { toast } from "react-toastify";

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

  const handleCreateCourse = async () => {
    setDisabled(true);
    await toast.promise(
      createCourse(abbr, name, annotation, guarantor, setCourses, authHeader),
      {
        pending: 'Předmět se tvoří',
        success: 'Předmět vytvořen',
        error: 'Problém s tvorbou předmětu'
      }
    );
    
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
        <Autocomplete
            value={guarantor}
            disabled={disabled}
            onChange={(event: any, newValue: string | null) => {
              console.log(event);
              setGuarantor(newValue? newValue : guarantor);
            }}
            id="controllable-states-type"
            options={guarantors}
            fullWidth
            renderInput={(params) => <TextField {...params} />}
            />
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
