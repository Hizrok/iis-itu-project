// @author Tomáš Vlach

import { ListItemButton, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import colorConfigs from "../../configs/ColourConfig";
import { RouteType } from "../../routes/config";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ColourConfig from "../../configs/ColourConfig";

type Props = {
  item: RouteType;
};

const SidebarItem = ({ item }: Props) => {
  const { appState } = useSelector((state: RootState) => state.appState);

  return (
    item.sidebarProps && item.path ? (
      <ListItemButton
        component={Link}
        to={item.path}
        sx={{
          "&: hover": {
            backgroundColor: colorConfigs.sidebar.hoverBg
          },
          background: ColourConfig.sidebar.highlightBg,
          backgroundColor: appState === item.state ? colorConfigs.sidebar.activeBg : ColourConfig.sidebar.highlightBg,
          paddingY: "12px",
          paddingX: "0px",
          marginBottom: "2px",
          boxShadow:5
        }}
      >
        <ListItemText
            disableTypography
            primary={
              <Typography sx={{paddingLeft:"10px"}}>
                {item.sidebarProps.displayText}
              </Typography>
            }
        />
        
      </ListItemButton>
    ) : null
  );
};

export default SidebarItem;