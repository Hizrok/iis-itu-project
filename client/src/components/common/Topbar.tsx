import { AppBar, Chip, Toolbar, Typography, withTheme } from '@mui/material';
import SizeConfig from "../../configs/SizeConfig";
import ColourConfig from "../../configs/ColourConfig";
import { Link } from 'react-router-dom';

function Topbar() {
    return(
        <AppBar position="absolute"  sx={{width: `calc(100% - ${SizeConfig.sidebar.width})`, ml: SizeConfig.sidebar.width, boxShadow:"unset", backgroundColor:ColourConfig.topbar.bg, color:ColourConfig.topbar.colour}}>
            <Toolbar>
                <Typography variant='h6'>
                    Maketa stránky pro registraci předmětů a cvičení
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