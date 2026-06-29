/* eslint-disable @typescript-eslint/no-explicit-any */

import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { NAVIGATION } from "./SideMenuItems";
import { UserProfile } from "./userBox";
import logo from "../../../assets/images/logo.png";
import { Box } from "@mui/material";

const demoTheme = createTheme({
  colorSchemes: { light: true },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: "#2E7D32", // Replace this with your logo's color
    },
  },
  components: {
    // Override MUI Toolpad components to fix spacing issues
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '0 !important',
          margin: '0 !important',
          maxWidth: 'none !important',
          width: '100%',
        },
      },
    },
  },
});

export function MainLayout(props: any) {
  const { window } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const router = React.useMemo(
    () => ({
      pathname: location.pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path: string | URL) => navigate(String(path)),
    }),
    [location.pathname, location.search, navigate]
  );

  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={{
        title: "Admin Portal",
        logo: (
          <img
            src={logo}
            alt="Company Logo"
            style={{
              height: 40,
              width: "auto",
              objectFit: "contain",
            }}
          />
        ),
      }}
    >
      <DashboardLayout
        slots={{ toolbarActions: UserProfile }}
        sx={{
          '& .MuiContainer-root': {
            padding: '0 !important',
            margin: '0 !important',
            maxWidth: 'none !important',
          },
          '& [data-toolpad-content]': {
            padding: '0 !important',
            margin: '0 !important',
            width: '100%',
            maxWidth: 'none !important',
          },
          // Target the main content area specifically
          '& .MuiBox-root[role="main"]': {
            padding: '0 !important',
            margin: '0 !important',
            width: '100%',
            maxWidth: 'none !important',
          },
          // Ensure proper width calculation when sidebar collapses
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        <PageContainer
          title=""
          sx={{
            padding: '0 !important',
            margin: '0 !important',
            width: '100%',
            maxWidth: 'none !important',
            '& .MuiContainer-root': {
              padding: '0 !important',
              margin: '0 !important',
              maxWidth: 'none !important',
              width: '100%',
            },
            // Remove any default container constraints
            '& > *': {
              width: '100%',
              maxWidth: 'none !important',
            },
          }}
          breadcrumbs={[]}
        >
          <Box sx={{ width: '100%', height: '100%', p:2}}>
            <Outlet />
          </Box>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}