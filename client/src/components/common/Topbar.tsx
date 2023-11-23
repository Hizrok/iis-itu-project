import { AppBar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Toolbar, Typography } from '@mui/material';
import SizeConfig from "../../configs/SizeConfig";
import ColourConfig from "../../configs/ColourConfig";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AppRoutes from '../../routes/AppRoutes';
import { useIsAuthenticated, useSignIn, useSignOut } from 'react-auth-kit';
import React from 'react';

function Topbar() {
    // Top bar nav
    const location = useLocation();
    const [output, setOutput] = useState("Registační stránka");

    // Account settings
    const isAuthenticated = useIsAuthenticated();
    const signOut = useSignOut();
    const signIn = useSignIn();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = React.useState("");

    // Handle logout popup
    const [logoutDialog, setLogoutDialog] = React.useState(false);
    const [loginDialog, setLoginDialog] = React.useState(false);

    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogoutDialogClose = () => {
        setLogoutDialog(false);
        signOut();
        navigate("/");
    };

    const handleLogin = () => {
        async function loginUser() {

            const login_user = {
            login: login,
            password: password
            };

            try{
                const request = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(login_user),
                });
                
                if(request.status >= 400){
                    setErrorMessage("An incorrect login or password");
                    setPassword("");
                    return;
                }
                
                const request_json = await request.json();
                if(signIn({
                    token: request_json.token,
                    expiresIn:  60,
                    tokenType: "Bearer",
                    authState: {login: request_json.login, role: request_json.role}
                })){
                    setLogin("");
                    setPassword("");
                    setErrorMessage("");
                    setLoginDialog(false);
                }
            }
            catch(err){
                console.log(err);
                setErrorMessage("An error has occured");
            }
            
        }
        loginUser();
    };

    useEffect(() => {
        AppRoutes.some((value) => { if(location.pathname.includes(value.path? value.path : "")){setOutput(value.topbarText? value.topbarText : output); return;}});
    }, [location]);

    if(isAuthenticated()){
        return(
            <AppBar position="absolute"  sx={{width: `calc(100% - ${SizeConfig.sidebar.width})`, ml: SizeConfig.sidebar.width, boxShadow:"unset", backgroundColor:ColourConfig.topbar.bg, color:ColourConfig.topbar.colour}}>
                <Toolbar>
                    <Typography variant='h6'>
                        {"> " + output} 
                    </Typography>
                    <Box 
                        sx={{ marginLeft: "auto" }}>
                        <Chip label="Account" 
                            clickable
                            component={Link}
                            to={"/account"}
                            sx={{ marginLeft: 1 }}/>

                        <Chip label="Logout" 
                            clickable
                            onClick={() => {setLogoutDialog(true);}}
                            sx={{ marginLeft: 1 }}/> 
                    </Box>
                    <Dialog open={logoutDialog} onClose={() => {setLogoutDialog(false);}}>
                        <DialogTitle>Logout</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure to logout?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={() => {setLogoutDialog(false);}}>Cancel</Button>
                        <Button onClick={handleLogoutDialogClose}>Logout</Button>
                        </DialogActions>
                    </Dialog>
                </Toolbar>            
            </AppBar>

            
        )
    }
    return(
        <AppBar position="absolute"  sx={{width: `calc(100% - ${SizeConfig.sidebar.width})`, ml: SizeConfig.sidebar.width, boxShadow:"unset", backgroundColor:ColourConfig.topbar.bg, color:ColourConfig.topbar.colour}}>
            <Toolbar>
                <Typography variant='h6'>
                    {"> " + output} 
                </Typography>
                <Box 
                    sx={{ marginLeft: "auto" }}>
                    <Chip label="Login" 
                    clickable
                    onClick={() => {setLoginDialog(true);}}/> 
                </Box>
                <Dialog open={loginDialog} onClose={() => {setLoginDialog(false);}}>
                    <DialogTitle>Login</DialogTitle>
                    <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="login"
                        label="Login"
                        type="login"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setLogin(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </DialogContent>
                    <DialogContentText>
                        {errorMessage}
                    </DialogContentText>
                    <DialogActions>
                    <Button onClick={() => {setLoginDialog(false);}}>Cancel</Button>
                    <Button onClick={handleLogin}>Login</Button>
                    </DialogActions>
                </Dialog>
            </Toolbar>            
        </AppBar>
    )
    
}

export default Topbar;