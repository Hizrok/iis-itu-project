// @author Tomáš Vlach

import { Drawer, List, Toolbar, Stack, Typography } from "@mui/material"
import { Link } from "react-router-dom";
import SizeConfig from "../../configs/SizeConfig"
import ColourConfig from "../../configs/ColourConfig"
import AppRoutes from "../../routes/AppRoutes"
import SidebarItem from "./SidebarItem"
import SidebarItemCollapse from "./SidebarItemCollapse"
import { useAuthUser, useIsAuthenticated } from "react-auth-kit";
import Logo from "../../assets/logo.png";

const Sidebar = () => {
    const isAuthenticated = useIsAuthenticated();
    const auth = useAuthUser();

    return(
        <Drawer variant="permanent"
                sx={{
                width: SizeConfig.sidebar.width,
                flexShrink: 0,
                "& .MuiDrawer-paper": {width: SizeConfig.sidebar.width, 
                    boxSizing: "border-box", 
                    borderRight: "0px", 
                    backgroundColor: ColourConfig.sidebar.bg,
                    color: ColourConfig.sidebar.colour
                }}} >
            <List>
                <Toolbar
                    sx={{margin:3}}
                    component={Link}
                    to={"/"}>
                    <Stack>
                        <Typography 
                            variant='h6' 
                            textAlign={'center'} 
                            sx={{
                                marginLeft: 1,
                                color:"#FFFFFF", 
                                background:ColourConfig.sidebar.highlightBg,
                                "&: hover": {backgroundColor: ColourConfig.sidebar.hoverBg},
                                boxShadow:5}}>
                            <img style={{width: 180, height: 120}} src={Logo} alt="Logo" />
                        </Typography>
                    </Stack>
                </Toolbar>
                {AppRoutes.map((route, index) => (
                    route.authenticated ?
                        isAuthenticated() ?
                            route.roles?.includes(auth()!.role)?
                                route.sidebarProps ? (
                                    route.child ? (
                                    <SidebarItemCollapse item={route} key={index} />
                                    ) : (
                                    <SidebarItem item={route} key={index} />
                                    )
                                ) : null 
                            : null
                        : null
                    :
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