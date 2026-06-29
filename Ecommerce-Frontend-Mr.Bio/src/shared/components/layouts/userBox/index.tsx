/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import * as React from "react";
import { useAuth } from "../../../../services/auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../../../services/auth/AuthContext";
import { LogOut, User, UserCircle2Icon } from "lucide-react";
import { SwapHoriz } from "@mui/icons-material";

// Define menu items configuration
type MenuItemType = {
  id: string;
  label?: string;
  icon?: React.ComponentType<any>;
  isDivider?: boolean;
};

const menuItems: MenuItemType[] = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
    {
      id: 'user',
      label: 'Login as User',
      icon: SwapHoriz,
    },
  {
    id: "divider",
    isDivider: true,
  },
  {
    id: "logout",
    label: "Logout",
    icon: LogOut,
  },
];

// User Profile Component
export function UserProfile() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (itemId: string) => {
    switch (itemId) {
      case "profile":
        navigate("/admin/user-profile", { replace: true });
        break;
      case "user":
        navigate("/home", { replace: true });
        break;
      case "logout":
        logout();
        navigate("/home/login", { replace: true });
        break;
      default:
        console.log("Unknown menu item clicked");
    }
    handleClose();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 1 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar sx={{ width: 32, height: 32 }}>
          <UserCircle2Icon />
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            minWidth: 200,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
      >
        {menuItems.map((item) => {
          if (item.isDivider) {
            return <Divider key={item.id} />;
          }

          const IconComponent = item.icon!;
          return (
            <MenuItem key={item.id} onClick={() => handleMenuClick(item.id)}>
              <ListItemIcon>
                <IconComponent fontSize="small" />
              </ListItemIcon>
              {item.label}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
