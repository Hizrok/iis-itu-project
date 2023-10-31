import { ListItemButton, ListItemIcon } from "@mui/material";
import { Link } from "react-router-dom";
import colorConfigs from "../../configs/ColourConfig";
import { RouteType } from "../../routes/config";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

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
          backgroundColor: appState === item.state ? colorConfigs.sidebar.activeBg : "unset",
          paddingY: "12px",
          paddingX: "35px"
        }}
      >
        <ListItemIcon sx={{
          color: colorConfigs.sidebar.colour
        }}>
          {item.sidebarProps.icon && item.sidebarProps.icon}
        </ListItemIcon>
        {item.sidebarProps.displayText}
      </ListItemButton>
    ) : null
  );
};

export default SidebarItem;