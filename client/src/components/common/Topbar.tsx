import {
  AppBar,
  Fab,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SizeConfig from "../../configs/SizeConfig";
import ColourConfig from "../../configs/ColourConfig";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppRoutes from "../../routes/AppRoutes";
import {
  useAuthUser,
  useIsAuthenticated,
  useSignIn,
  useSignOut,
} from "react-auth-kit";
import { useDispatch } from "react-redux";
import { setLoadingState } from "../../redux/features/LoadingStateSlice";
import { useConfirm } from "material-ui-confirm";
import { toast } from "react-toastify";
import axios from "axios";
import LoginDialog from "./LoginDialog";

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
  const confirm = useConfirm();

  // Handle login popup
  const [showDialog, setShowDialog] = useState(false);


  const dispatch = useDispatch();

  const logoutDialogCheck = () => {
    confirm({ description: "Chcete se odhlásit?", confirmationText: "Ano", cancellationText: "Ne", title: "Odhlášení", confirmationButtonProps: { color: "error" }  })
      .then(() => {
        signOut();
        navigate("/");
        toast.success('Odhlášen');
      })
      .catch(() => {
        
      });
  }

  const login = async (
    id: string,
    password: string,
  ) => {
    dispatch(setLoadingState(true));
    await axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}login`,
        { id, password }
      )
      .then((res) => {
        const loginRes = res.data.id;
        if (
          signIn({
            token: loginRes.token,
            expiresIn: 60,
            tokenType: "Bearer",
            authState: { id: loginRes.id, role: loginRes.role },
          })
        ) {
          setShowDialog(false);
          dispatch(setLoadingState(false));
          toast.success('Přihlášení proběhlo uspěšně');
        }
      })
      .catch((err) => {
        console.error(err.message); 
        if (err.response.status == 403) {
          toast.error('Špatné přihlašovací údaje');
        }
        else if (err.response.status > 400) {
          toast.error('Problém s přihlášením');
        }
        
        dispatch(setLoadingState(false));
      });
  };

  useEffect(() => {
    AppRoutes.some((value) => {
      if (
        location.pathname.includes(value.path ? value.path.split(":")[0] : "")
      ) {
        setTopbarTitle(value.topbarText ? value.topbarText : topbarTitle);
        document.title = value.topbarText
          ? value.topbarText + " - Registační stránka"
          : topbarTitle + " - Registační stránka";
      }
    });
  }, [location]);

  if (isAuthenticated()) {
    return (
      <AppBar
        position="absolute"
        sx={{
          width: `calc(100% - ${SizeConfig.sidebar.width})`,
          ml: SizeConfig.sidebar.width,
          boxShadow: "unset",
          backgroundColor: ColourConfig.topbar.bg,
          color: ColourConfig.topbar.colour,
        }}
      >
        <Toolbar sx={{boxShadow:3}}>
          <ArrowForwardIosIcon />
          <Typography variant="h6">{topbarTitle}</Typography>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ marginLeft: "auto" }}
          >
            <Fab
              variant="extended"
              component={Link}
              to={"/account"}
              sx={{ maxHeight: 35 }}
            >
              <AccountCircleIcon sx={{ mr: 1 }} />
              {isAuthenticated() ? auth()!.id : "NULL"}
            </Fab>

            <Fab
              aria-label="add"
              variant="extended"
              onClick={() => {
                logoutDialogCheck();
              }}
              sx={{ maxHeight: 35 }}
            >
              <LogoutIcon sx={{ mr: 1 }} />
              Odhlásit
            </Fab>
          </Stack>
        </Toolbar>
      </AppBar>
    );
  }
  return (
    <AppBar
      position="absolute"
      sx={{
        width: `calc(100% - ${SizeConfig.sidebar.width})`,
        ml: SizeConfig.sidebar.width,
        boxShadow: "unset",
        backgroundColor: ColourConfig.topbar.bg,
        color: ColourConfig.topbar.colour,
      }}
    >
      <Toolbar>
        <ArrowForwardIosIcon />
        <Typography variant="h6">{topbarTitle}</Typography>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ marginLeft: "auto" }}
        >
          <Fab
            variant="extended"
            sx={{ maxHeight: 35 }}
            onClick={() => {
              setShowDialog(true);
            }}
          >
            <LoginIcon sx={{ mr: 1 }} />
            Přihlásit
          </Fab>
        </Stack>
        <LoginDialog 
          showDialog={showDialog}
          toggleDialog={setShowDialog}
          loginUser={login}
          />
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
