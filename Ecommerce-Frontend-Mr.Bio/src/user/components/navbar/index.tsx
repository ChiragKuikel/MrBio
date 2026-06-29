import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import MidNavBar from "./searchNavBar";
import TopNavbar from "./topNavBar";
import Footer from "../footer/footerContainer";

const NavigationBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Full viewport height
      }}
    >
      {/* Navigation Headers */}
      {!isMobile && <TopNavbar />}
      <MidNavBar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Box>
      <Footer/>
    </Box>
  );
};

export default NavigationBar;
