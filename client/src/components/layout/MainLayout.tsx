import { Outlet } from "react-router-dom";
import { Backdrop, Box, Stack, Toolbar } from "@mui/material";
import Topbar from "../common/Topbar";
import Sidebar from "../common/Sidebar";
import SizeConfig from "../../configs/SizeConfig";
import ColourConfig from "../../configs/ColourConfig";
import Footer from "../common/Footer";
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
const MainLayout = () => {
    
    const { loadingState } = useSelector((state: RootState) => state.loadingState);

    const { loadingContentState } = useSelector((state: RootState) => state.loadingContetnState);


    return(
        <Box sx={{display:"flex"}}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => Math.max.apply(Math, Object.values(theme.zIndex)) + 1 }}
                open={loadingState}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Topbar/>
            <Box component="nav" sx={{width: SizeConfig.sidebar.width, flexshring: 0}}>
                <Sidebar/>
            </Box>
            <Stack spacing={1} sx={{ flexGrow:1, width: `calc(100% -${SizeConfig.sidebar.width})`, paddingLeft:"auto" , minHeight: "100vh"}} >
                <Box component="main" sx={{flexGrow:1, p:3, width: `calc(100% -${SizeConfig.sidebar.width})`, paddingLeft:"auto" , minHeight: "100vh", backgroundColor: ColourConfig.mainBg}} >
                    <Backdrop open={loadingContentState}>
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                    <Toolbar/>
                    <Outlet/>
                </Box>
                <Box component="footer" sx={{flexGrow:1, p:3, width: `calc(100% -${SizeConfig.sidebar.width})`, paddingLeft:"auto" , minHeight: "10vh", backgroundColor: ColourConfig.footerBg}}>
                    <Footer />
                </Box>
            </Stack>
        </Box>
    )
}

export default MainLayout;