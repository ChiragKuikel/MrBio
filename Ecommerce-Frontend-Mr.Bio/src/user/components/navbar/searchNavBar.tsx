/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AccountCircle,
  ExitToApp,
  Person,
  ShoppingCartOutlined,
  SwapHoriz,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mrbiologo from "../../../assets/icon/mrbiologo.png";
// import { useAuth } from "../../../services/auth/context/AuthContext";
import { useAuth } from "../../../services/auth/AuthContext";
import useGetCartCount from "../../../shared/hooks/user/addToCart/get/useGetCartCount";
import { COLOR_PALLETE } from "../../constants/Theme";
import NavBar from "./navBar";
import { ListOrdered } from "lucide-react";

// Create custom theme (same as before)
const theme = createTheme({
  palette: {
    primary: {
      main: `${COLOR_PALLETE?.DARK_GREY}`,
    },
    background: {
      default: "#ffffff",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          border: "1px solid rgba(0,0,0,0.08)",
          minWidth: 200,
          mt: 1,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: "12px 16px",
          borderRadius: 8,
          margin: "4px 8px",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.08)",
            transform: "translateX(2px)",
          },
          "&:first-of-type": {
            marginTop: 8,
          },
          "&:last-of-type": {
            marginBottom: 8,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
          minWidth: 400,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "20px 24px",
          "& .MuiTypography-root": {
            fontWeight: 600,
            fontSize: "1.25rem",
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "16px 24px 24px",
          gap: "12px",
        },
      },
    },
  },
});

const MidNavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isAuthenticated = localStorage.getItem("access_token");
  const [openDialog, setOpenDialog] = useState(false);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("access_token");
  //Get list for Total Count
  const { data: totalCount } = useGetCartCount(userId, token || "");

  // Open confirmation dialog
  // const handleLoginClick = () => {
  //   if (isAuthenticated) {
  //     setOpenDialog(true);
  //   } else {
  //     navigate("/home/login");
  //   }
  // };

  const handleLogoutConfirm = () => {
    logout();
    navigate("/home/login");
    setOpenDialog(false);
    toast.success("You have successfully logged out!");
  };

  const handleLogoutCancel = () => {
    setOpenDialog(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isAuthenticated) {
      setAnchorEl(event.currentTarget);
    } else {
      navigate("/home/login");
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate("/home/my-profile");
    handleMenuClose();
  };

  const handleAdmninPortalClick = () => {
    navigate("/admin/dashboard");
    handleMenuClose();
  };
  const handleViewMyOrders = () => {
    navigate("/home/my-order-history");
    handleMenuClose();
  };

  const handleLogoutMenuClick = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleMyCart = () => {
    navigate(`/home/my-cart`); // Navigate to My Cart page
  };
  const checkLocalStorage = localStorage.getItem("access_token");

  // Function to get user initial
  const getUserInitial = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}`.toUpperCase();
    } else if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return ""; // fallback
  };
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" elevation={1}>
        <Container maxWidth={false} sx={{ px: 0 }}>
          <Toolbar
            disableGutters
            sx={{
              py: 1,
              px: { xs: 2, sm: 3, md: 10, lg: 12 },
            }}
          >
            {/* Logo Section */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="img"
                src={mrbiologo}
                alt="Logo"
                sx={{
                  height: 60,
                  width: "auto",
                  mr: { xs: 2, md: 4 },
                  cursor: "pointer",
                }}
                onClick={() => navigate("/home")}
              />
            </Box>
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              <NavBar />
            </Box>
            {/* Right Side Icons */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.5, sm: 2, md: 2.5 },
                ml: "auto",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Badge
                  badgeContent={totalCount}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      color: "white",
                      fontSize: "10px",
                      minWidth: 16,
                      height: 16,
                    },
                  }}
                >
                  <ShoppingCartOutlined
                    onClick={handleMyCart}
                    sx={{ color: `${COLOR_PALLETE?.DARK_GREY}`, fontSize: 24 }}
                  />
                </Badge>
                <Typography
                  variant="body2"
                  sx={{
                    ml: 1,
                    color: `${COLOR_PALLETE?.DARK_GREY}`,
                    fontWeight: 500,
                    display: { xs: "none", md: "block" },
                  }}
                  onClick={handleMyCart}
                >
                  Cart
                </Typography>
              </Box>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: "grey.400", mx: 0.5 }}
              />

              {/* Enhanced User Menu */}
              <Box>
                <IconButton
                  onClick={handleMenuClick}
                  sx={{
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                    },
                  }}
                >
                  {isAuthenticated ? (
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: COLOR_PALLETE?.DARK_GREY,
                        fontSize: "14px",
                      }}
                    >
                      {getUserInitial()}
                    </Avatar>
                  ) : (
                    <Person sx={{ color: `${COLOR_PALLETE?.DARK_GREY}` }} />
                  )}
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.12))",
                      "&:before": {
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
                  <MenuItem onClick={handleProfileClick}>
                    <ListItemIcon>
                      <AccountCircle
                        sx={{
                          color: "primary.main",
                          fontSize: 20,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Profile"
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: "0.95rem",
                      }}
                    />
                  </MenuItem>
                  {user?.roles?.includes("ADMIN") && (
                    <MenuItem onClick={handleAdmninPortalClick}>
                      <ListItemIcon>
                        <SwapHoriz
                        // sx={{
                        //   color: "primary.main",
                        //   fontSize: 20,
                        // }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary="Login as Admin"
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: "0.95rem",
                        }}
                      />
                    </MenuItem>
                  )}
                  {checkLocalStorage && (
                    <MenuItem onClick={handleViewMyOrders}>
                      <ListItemIcon>
                        <ListOrdered
                        // sx={{
                        //   color: "primary.main",
                        //   fontSize: 20,
                        // }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary="My Order History"
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: "0.95rem",
                        }}
                      />
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogoutMenuClick}>
                    <ListItemIcon>
                      <ExitToApp
                        sx={{
                          color: "#f44336",
                          fontSize: 20,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Logout"
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        color: "#f44336",
                      }}
                    />
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Enhanced Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleLogoutCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ExitToApp sx={{ fontSize: 28 }} />
            <Typography variant="h6" component="span">
              Confirm Logout
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                lineHeight: 1.6,
                color: "text.secondary",
              }}
            >
              Are you sure you want to log out? You'll need to sign in again to
              access your account.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleLogoutCancel}
            variant="outlined"
            sx={{
              borderRadius: 8,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderColor: "grey.300",
              color: "text.primary",
              "&:hover": {
                borderColor: "grey.400",
                backgroundColor: "grey.50",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            sx={{
              borderRadius: 8,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
              boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #d32f2f 0%, #c62828 100%)",
                boxShadow: "0 6px 16px rgba(244, 67, 54, 0.4)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </ThemeProvider>
  );
};

export default MidNavBar;
