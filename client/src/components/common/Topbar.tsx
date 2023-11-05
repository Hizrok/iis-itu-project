import { AppBar, Chip, Toolbar, Typography } from '@mui/material';
import SizeConfig from "../../configs/SizeConfig";
import ColourConfig from "../../configs/ColourConfig";
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AppRoutes from '../../routes/AppRoutes';

function Topbar() {
    const location = useLocation();
    const [output, setOutput] = useState("Registační stránka");

    useEffect(() => {
        AppRoutes.some((value) => { if(location.pathname.includes(value.path? value.path : "")){setOutput(value.sidebarProps? value.sidebarProps.displayText : "Registační stránka"); return;}});
    }, [location]);

    return(
        <AppBar position="absolute"  sx={{width: `calc(100% - ${SizeConfig.sidebar.width})`, ml: SizeConfig.sidebar.width, boxShadow:"unset", backgroundColor:ColourConfig.topbar.bg, color:ColourConfig.topbar.colour}}>
            <Toolbar>
                <Typography variant='h6'>
                    {"> " + output} 
                </Typography>
                <Chip label="Account" 
                    clickable
                    component={Link}
                    to={"/account"}
                    sx={{ marginLeft: "auto" }}/>
                    
            </Toolbar>            
        </AppBar>
    )
}

export default Topbar;