import { Drawer, List, Toolbar, Stack, Typography, Button } from "@mui/material"
import { Link } from "react-router-dom";
import SizeConfig from "../../configs/SizeConfig"
import ColourConfig from "../../configs/ColourConfig"
import AppRoutes from "../../routes/AppRoutes"
import SidebarItem from "./SidebarItem"
import SidebarItemCollapse from "./SidebarItemCollapse"

const Sidebar = () => {

    return(
        <Drawer variant="permanent"
                sx={{
                width: SizeConfig.sidebar.width,
                flexShrink: 0,
                "& .MuiDrawer-paper": {width: SizeConfig.sidebar.width, boxSizing: "border-box", borderRight: "0px", backgroundColor: ColourConfig.sidebar.bg, color: ColourConfig.sidebar.colour}}} >
            <List>
                <Toolbar
                    sx={{margin:3}}
                    component={Link}
                    to={"/"}>
                    <Stack>
                        <Typography variant='h6' textAlign={'center'} sx={{paddingLeft:8, paddingRight:8, paddingTop:6, paddingBottom:6, color:"#FFFFFF", background:ColourConfig.sidebar.highlightBg}}>
                            LOGO
                        </Typography>
                    </Stack>
                </Toolbar>
                {AppRoutes.map((route, index) => (
                    route.sidebarProps ? (
                        route.child ? (
                        <SidebarItemCollapse item={route} key={index} />
                        ) : (
                        <SidebarItem item={route} key={index} />
                        )
                    ) : null
                    ))}
            </List>
        </Drawer>
    )
}

export default Sidebar