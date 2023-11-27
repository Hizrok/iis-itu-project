import { Typography } from "@mui/material"
import { Box, Stack } from "@mui/system"

const Footer = () => {

    return(
        <>
        <Stack direction={"row"}>
            <Box>
                <Typography sx={{fontSize:12}}>Vytvořili:</Typography>
                <Typography sx={{fontSize:10}}>Jan Kapsa</Typography>
                <Typography sx={{fontSize:10}}>Tomáš Vlach</Typography>
                <Typography sx={{fontSize:10}}>Petr Teichgráb</Typography>
            </Box>
            <Box sx={{marginLeft:"auto"}}>
                <Typography sx={{fontSize:12}}>Technologie:</Typography>
                <Typography sx={{fontSize:10}}>Vite + React-ts</Typography>
                <Typography sx={{fontSize:10}}>Node.js nodemon</Typography>
                <Typography sx={{fontSize:10}}>Postgresql 15</Typography>
            </Box>
        </Stack>
        </>
    )
}

export default Footer