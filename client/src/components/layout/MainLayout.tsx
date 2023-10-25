import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Topbar from "../common/Topbar";
import Sidebar from "../common/Sidebar";
import SizeConfig from "../../configs/SizeConfig";
import ColourConfig from "../../configs/ColourConfig";

const MainLayout = () => {

    return(
        <Box sx={{display:"flex"}}>
            <Topbar/>
            <Box component="nav" sx={{width: SizeConfig.sidebar.width, flexshring: 0}}>
                <Sidebar/>
            </Box>
            <Box component="main" sx={{flexGrow:1, p:3, width: `calc(100% -${SizeConfig.sidebar.width})`, paddingLeft:"auto" , minHeight: "100vh", backgroundColor: ColourConfig.mainBg}} >
                <Toolbar/>
                <Outlet/>
            </Box>
        </Box>
    )
}

export default MainLayout;