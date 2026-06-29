/* eslint-disable @typescript-eslint/no-explicit-any */
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Typography,
  Container,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import mrbiologo from "../../../assets/icon/mrbiologo.png";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { COLOR_PALLETE } from "../../constants/Theme";

interface NavItem {
  label: string;
  dropdown?: boolean;
  dropdownItems?: any;
  sectionId?: any;
  route?: string;
}

const NavBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuType, setMenuType] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(""); // Track active tab
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  // Set active tab based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = navItems.find(
      (item) =>
        item.route === currentPath ||
        (currentPath === "/" && item.route === "/home")
    );

    if (activeItem) {
      setActiveTab(activeItem.route || activeItem.label);
    }
  }, [location]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    type: string
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuType(type);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuType("");
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const scrollToSection = (
    sectionId: string,
    isMobileView: boolean = false
  ) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = isMobileView ? -50 : -150;
      const rect = section.getBoundingClientRect();
      const top = rect.top + window.scrollY + offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
    setDrawerOpen(false);
    handleMenuClose();
  };

  const handleNavigation = (item: NavItem, isMobileView: boolean = false) => {
    // Set active tab
    setActiveTab(item.route || item.label);

    if (item.route) {
      navigate(item.route);
    } else if (item.sectionId) {
      scrollToSection(item.sectionId, isMobileView);
    }

    setDrawerOpen(false);
    handleMenuClose();
  };

  const navItems: NavItem[] = [
    { label: "HOME", sectionId: "home-section", route: "/home" },
    {
      label: "OUR PRODUCTS",
      sectionId: "services-section",
      route: "/home/our-products",
    },
    
    { label: "BLOG", sectionId: "blog-section", route: "our-blogs" },
    { label: "ABOUT US", sectionId: "about-section", route: "/home/about-us" },
    // { label: "CONTACT US", sectionId: "contact-section", route: "contact-us" },
  ];

  const renderDropdownMenu = (item: NavItem) => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl) && menuType === item.label}
      onClose={handleMenuClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      PaperProps={{
        elevation: 3,
        sx: { mt: 1.5, borderRadius: 1 },
      }}
    >
      {item.dropdownItems?.map((option: any, index: any) => (
        <MenuItem
          key={index}
          onClick={() => {
            if (option.sectionId) {
              scrollToSection(option.sectionId);
            }
            handleMenuClose();
          }}
          sx={{
            fontFamily: "Poppins",
            fontSize: "0.9rem",
            minWidth: "180px",
            py: 1,
          }}
        >
          {option}
        </MenuItem>
      ))}
    </Menu>
  );

  const renderMobileDrawer = () => (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={handleDrawerToggle}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 300 },
          p: 0,
          bgcolor: "background.paper",
        },
      }}
      sx={{
        "& .MuiDrawer-paper": {
          transition: "all 0.3s ease-out",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Box
          component="img"
          src={mrbiologo}
          alt="Logo"
          sx={{ height: 50, width: "auto" }}
        />
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List disablePadding>
        {navItems?.map((item) => {
          const isActive = activeTab === (item.route || item.label);
          return (
            <React.Fragment key={item.label}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item, true)}
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    backgroundColor: isActive
                      ? "rgba(119, 184, 49, 0.1)"
                      : "inherit",
                  }}
                >
                  <ListItemText
                    primary={item?.label}
                    primaryTypographyProps={{
                      fontFamily: "Poppins",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "1rem",
                      color: isActive ? "#77b831" : "inherit",
                    }}
                  />
                  {item?.dropdown && <ArrowDropDownIcon />}
                </ListItemButton>
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>
    </Drawer>
  );

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0} // Removes MUI default box-shadow
      sx={{
        border: "none", // Ensures no border
        boxShadow: "none", // Removes shadow explicitly
        backgroundColor: "#fff", // Optional: match background
      }}
    >
      <Container maxWidth="lg" sx={{ px: 0 }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          {isMobile ? (
            <IconButton edge="end" onClick={handleDrawerToggle} sx={{ ml: 1 }}>
              <MenuIcon />
            </IconButton>
          ) : (
            /* Desktop Navigation */
            <Box display="flex" alignItems="center" gap={{ md: 3, lg: 4 }}>
              {navItems.map((item) => {
                const isActive = activeTab === (item.route || item.label);
                return (
                  <Box key={item.label}>
                    <Typography
                      onClick={
                        item.dropdown
                          ? (e) => handleMenuOpen(e, item.label)
                          : () => handleNavigation(item)
                      }
                      sx={{
                        fontWeight: isActive ? 700 : 500,
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        color: isActive ? "#77b831" : COLOR_PALLETE?.DARK_GREY,
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        transition: "all 0.2s",
                        "&:hover": {
                          color: "#77b831",
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          width: isActive ? "80%" : "0%",
                          height: "2px",
                          bottom: "-5px",
                          left: "50%",
                          background: "#77b831",
                          transform: "translateX(-50%)",
                          transition: "all 0.3s ease",
                        },
                      }}
                    >
                      {item.label}
                      {item.dropdown && (
                        <ArrowDropDownIcon
                          sx={{ ml: 0.5, fontSize: "1.2rem" }}
                        />
                      )}
                    </Typography>
                    {item.dropdown && renderDropdownMenu(item)}
                  </Box>
                );
              })}
            </Box>
          )}
          {renderMobileDrawer()}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
