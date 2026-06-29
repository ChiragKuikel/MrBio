// import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Box, Container, Stack, Typography } from "@mui/material";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        bgcolor: "#212529",
        color: "white",
        py: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" sx={{ mb: { xs: 2, sm: 0 } }}>
            Copyright © {currentYear}
            <Box
              component="a"
              href="#"
              sx={{
                color: "#fff",
                textDecoration: "none",
                mx: 0.5,
              }}
            >
              Mr.Bio Nepal
            </Box>
            . All Rights Reserved.
          </Typography>

          <Stack direction="row" spacing={1}>
            <Typography variant="body2" sx={{ mb: { xs: 2, sm: 0 } }}>
              Crafted By
              <Box
                component="a"
                href="#"
                sx={{
                  color: "#fff",
                  textDecoration: "none",
                  mx: 0.5,
                }}
              >
                Moonlight Creatives
              </Box>
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
