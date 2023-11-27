import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ColourConfig from "../../configs/ColourConfig";
import { RouteType } from "../../routes/config";
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import SidebarItem from "./SidebarItem";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type Props = {
  item: RouteType;
};

const SidebarItemCollapse = ({ item }: Props) => {
  const [open, setOpen] = useState(false);

  const { appState } = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    if (appState.includes(item.state)) {
      setOpen(true);
    }
  }, [appState, item]);

  return (
    item.sidebarProps ? (
      <>
        <ListItemButton
          onClick={() => setOpen(!open)}
          sx={{
            "&: hover": {
              backgroundColor: ColourConfig.sidebar.hoverBg
            },
            backgroundColor: ColourConfig.sidebar.highlightBg,
            paddingY: "12px",
            paddingX: "0px",
            marginBottom: "2px",
            boxShadow:5
          }}
        >
          <ListItemIcon sx={{marginLeft:"10px", color:"white"}}>
            {open ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />}
          </ListItemIcon>

          <ListItemText
            disableTypography
            primary={
              <Typography sx={{marginLeft:"10px"}}>
                {item.sidebarProps.displayText}
              </Typography>
            }
          />
        </ListItemButton>
        <Collapse in={open} timeout="auto">
          <List
            sx={{paddingLeft:"20px"}}
            >
            {item.child?.map((route, index) => (
              route.sidebarProps ? (
                route.child ? (
                  <SidebarItemCollapse item={route} key={index} />
                ) : (
                  <SidebarItem item={route} key={index} />
                )
              ) : null
            ))}
          </List>
        </Collapse>
      </>
    ) : null
  );
};

export default SidebarItemCollapse;