import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Stack, TextField, Toolbar, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SizeConfig from "../../configs/SizeConfig";
import ColourConfig from "../../configs/ColourConfig";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AppRoutes from '../../routes/AppRoutes';
import { useAuthUser, useIsAuthenticated, useSignIn, useSignOut } from 'react-auth-kit';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setLoadingState } from '../../redux/features/LoadingStateSlice';

function Topbar() {
    // Top bar nav
    const location = useLocation();
    const [topbarTitle, setTopbarTitle] = useState("Registační stránka");

    // Account settings
    const isAuthenticated = useIsAuthenticated();
    const signOut = useSignOut();
    const signIn = useSignIn();
    const auth = useAuthUser();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = React.useState("");

    // Handle logout popup
    const [logoutDialog, setLogoutDialog] = React.useState(false);
    const [loginDialog, setLoginDialog] = React.useState(false);

    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const dispatch = useDispatch();

    const handleLogoutDialogClose = () => {
        setLoginDialog(false);
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
                dispatch(setLoadingState(true));
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
                    dispatch(setLoadingState(false));
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
                    dispatch(setLoadingState(false));
                }
            }
            catch(err){
                console.log(err);
                setErrorMessage("An error has occured");
                dispatch(setLoadingState(false));
            }
            
        }
        loginUser();
    };

    useEffect(() => {
        AppRoutes.some((value) => { if(location.pathname.includes(value.path?value.path.split(":")[0]:"")){setTopbarTitle(value.topbarText? value.topbarText : topbarTitle); document.title = value.topbarText? value.topbarText+" - Registační stránka" : topbarTitle+" - Registační stránka";}});
    }, [location]);

    if(isAuthenticated()){
        return(
            <AppBar position="absolute"  sx={{width: `calc(100% - ${SizeConfig.sidebar.width})`, ml: SizeConfig.sidebar.width, boxShadow:"unset", backgroundColor:ColourConfig.topbar.bg, color:ColourConfig.topbar.colour}}>
                <Toolbar>
                    <ArrowForwardIosIcon/>
                    <Typography variant='h6'>
                        {topbarTitle} 
                    </Typography>
                    <Stack  direction="row" 
                            spacing={2} 
                            alignItems="center"
                            justifyContent="center"
                            sx={{ marginLeft: "auto"}}>

                        <Fab variant="extended"
                            component={Link}
                            to={"/account"}
                            sx={{maxHeight:35}}>
                                <AccountCircleIcon sx={{ mr: 1 }}/>
                                {isAuthenticated()?auth()!.login:"NULL"}
                            </Fab>

                        <Fab aria-label="add"
                            variant="extended"
                            onClick={() => {setLogoutDialog(true);}}
                            sx={{maxHeight:35}}> 
                                <LogoutIcon sx={{ mr: 1 }}/>
                                Logout
                            </Fab>

                    </Stack>
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
                <ArrowForwardIosIcon/>
                <Typography variant='h6'>
                        {topbarTitle} 
                    </Typography>
                <Stack  direction="row" 
                            spacing={2} 
                            alignItems="center"
                            justifyContent="center"
                            sx={{ marginLeft: "auto"}}>

                        <Fab variant="extended"
                            sx={{maxHeight:35}}
                            onClick={() => {setLoginDialog(true);}}>
                                <LoginIcon sx={{ mr: 1 }}/>
                                Login
                            </Fab>
                </Stack>
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