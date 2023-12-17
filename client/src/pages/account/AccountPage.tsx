
import { useEffect, useState } from "react";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { useDispatch } from "react-redux";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { Fab, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React from "react";


const AccountPage = () => {

    const auth = useAuthUser();

    const authHeader = useAuthHeader();

    const dispatch = useDispatch();

    
    const [id, setID] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
  

    //const [oldPasswd, setOldPasswd] = useState<string>("");
    //const [newPasswd, setNewPasswd] = useState<string>("");
    //const [newPasswdCheck, setNewPasswdCheck] = useState<string>("");

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    useEffect(() => {
      async function fetchUser() {
        dispatch(setLoadingContentState(true));
        try{
            const response = await fetch(`http://localhost:3000/users/${auth()!.id}`, {
                method: "GET", 
                headers: {
                  "Content-Type": "application/json",
                  "authorization": authHeader()
                }
            });
            const user_json = await response.json();
        
            setID(user_json.id !== null?user_json.id:"");
            setName(user_json.name !== null?user_json.name:"");
            setSurname(user_json.surname !== null?user_json.surname:"");
            setEmail(user_json.email !== null?user_json.email:"");
            
            dispatch(setLoadingContentState(false));
        }
        catch(err){
            console.log(err);
            dispatch(setLoadingContentState(false));
        }
        
      }

      fetchUser();
    }, []);

    const updateInfoHandle = () => {
        return;
    };

    const updatePasswdHandle = () => {
        return;
    };
  
    return(
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={4}>
                <Typography variant='h6' gridColumn={0} gridRow={0} alignSelf={"center"}>Uživatelské údaje</Typography>
                <Stack
                    alignItems={"center"}
                    spacing={2}
                    component="form"
                    sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' }
                    }}
                    noValidate
                    autoComplete="off"
                    gridColumn={0} 
                    gridRow={1}
                    >
                    <TextField
                        id="filled"
                        label="Login"
                        value={id}
                        variant="filled"
                        InputProps={{
                            readOnly: true,}}/>
                    <TextField
                        required
                        id="filled-required"
                        label="Jméno"
                        value={name}
                        variant="filled"
                        onChange={(e) => setName(e.target.value)}/>
                    <TextField
                        required
                        id="filled-required"
                        label="Příjmení"
                        value={surname}
                        variant="filled"
                        onChange={(e) => setSurname(e.target.value)}/>
                    <TextField
                        required
                        id="filled-required"
                        label="Email"
                        value={email}
                        variant="filled"
                        onChange={(e) => setEmail(e.target.value)}/>
                    <Fab variant="extended"
                        onClick={updateInfoHandle}
                        sx={{maxHeight:35, maxWidth:300}}>
                            Uložit změny
                    </Fab>
                </Stack>
            </Grid>
            
            <Grid item xs={4}>
                <Typography variant='h6' gridColumn={1} gridRow={0} alignSelf={"center"}>Změna hesla</Typography>
                <Stack
                    alignItems={"center"}
                    spacing={2}
                    component="form"
                    sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' }
                    }}
                    noValidate
                    autoComplete="off"
                    gridColumn={1} 
                    gridRow={1}
                    >
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Staré Heslo</InputLabel>
                        <OutlinedInput
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Staré Heslo"
                            //onChange={(e) => setOldPasswd(e.target.value)}
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Nové Heslo</InputLabel>
                        <OutlinedInput
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Nové Heslo"
                            //onChange={(e) => setNewPasswd(e.target.value)}
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Nové Heslo Znovu</InputLabel>
                        <OutlinedInput
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Nové Heslo Znovu"
                            //onChange={(e) => setNewPasswdCheck(e.target.value)}
                        />
                    </FormControl>
                    <Fab variant="extended"
                        onClick={updatePasswdHandle}
                        sx={{maxHeight:35, maxWidth:300}}>
                            Uložit změny
                    </Fab>
                </Stack>
            </Grid>
            
        </Grid>
    )
  };


export default AccountPage;