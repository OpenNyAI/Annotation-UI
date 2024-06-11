import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type NavigationItemProps = {
  isOpen: boolean;
  isSelected: boolean;
  to: string;
  title: string;
  icon: ReactNode;
};

export const NavigationItem = ({
  isOpen,
  isSelected,
  to,
  title,
  icon,
}: NavigationItemProps) => {
  return (
    <ListItem
      key={title}
      disablePadding
      sx={{
        display: "block",
        borderRadius: "8px",
        background: isSelected ? "#3B3B3B" : "inherit",
        "&:hover": {
          background: isSelected ? "#3B3B3B" : "#1B1B1B",
        },
      }}
    >
      <Link to={to} style={{ textDecoration: "inherit", color: "inherit" }}>
        <ListItemButton
          selected={isSelected}
          sx={{
            minHeight: 48,
            justifyContent: isOpen ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: isOpen ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText primary={title} sx={{ opacity: isOpen ? 1 : 0 }} />
        </ListItemButton>
      </Link>
    </ListItem>
  );
};
