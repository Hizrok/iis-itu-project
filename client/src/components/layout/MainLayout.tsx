import { Outlet } from "react-router-dom";
import { Box, Stack, Toolbar } from "@mui/material";
import Topbar from "../common/Topbar";
import Sidebar from "../common/Sidebar";
import SizeConfig from "../../configs/SizeConfig";
import ColourConfig from "../../configs/ColourConfig";
import Footer from "../common/Footer";

const MainLayout = () => {

    return(
        <Box sx={{display:"flex"}}>
            <Topbar/>
            <Box component="nav" sx={{width: SizeConfig.sidebar.width, flexshring: 0}}>
                <Sidebar/>
            </Box>
            <Stack spacing={1} sx={{flexGrow:1, width: `calc(100% -${SizeConfig.sidebar.width})`, paddingLeft:"auto" , minHeight: "100vh"}} >
                <Box component="main" sx={{flexGrow:1, p:3, width: `calc(100% -${SizeConfig.sidebar.width})`, paddingLeft:"auto" , minHeight: "100vh", backgroundColor: ColourConfig.mainBg}} >
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