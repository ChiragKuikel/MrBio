// TopNavbar.js
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Box,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { COLOR_PALLETE } from "../../constants/Theme";
import tiktok from "../../../assets/icon/tiktok.png";
const TopNavbar = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        py: { xs: 1.5, md: 2 },
        width: "100%",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {/* Change maxWidth="lg" to maxWidth={false} and potentially add px back to an inner element if needed */}
      <Container maxWidth={false} sx={{ px: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={{ xs: 1.5, md: 2, lg: 3 }}
          // Add padding here if you still want some space from the absolute edges
          // For example, if you want default MUI container padding but full width
          sx={{ px: { xs: 3, sm: 4, md: 6, lg: 12 } }} // You can adjust these values
        >
          {/* Contact Information */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 3 }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexWrap="wrap"
            sx={{
              width: { xs: "100%", md: "auto" },
              color: `${COLOR_PALLETE?.DARK_GREY}`,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOnIcon fontSize="small" />
              <Typography
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                }}
              >
                Hanumansthan, Kathmandu, Nepal
              </Typography>
            </Stack>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: "grey.400" }}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <CallIcon fontSize="small" />
              <Typography
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                }}
              >
                +977-9801030766
              </Typography>
            </Stack>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: "grey.400" }}
            />
            {!isSmall && (
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon fontSize="small" sx={{ color: "#EA4335" }} />
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=mrbionp@gmail.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    mrbionp@gmail.com
                  </Typography>
                </a>
              </Stack>
            )}


          </Stack>

          {/* Social Media Links */}
          <Stack
            direction="row"
            spacing={{ xs: 1.5, md: 2 }}
            alignItems="center"
            sx={{
              mt: { xs: 1, md: 0 },
              width: { xs: "100%", md: "auto" },
              justifyContent: { xs: "flex-start", md: "flex-end" },
              color: `${COLOR_PALLETE?.DARK_GREY}`,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
              }}
            >
              Find us on:
            </Typography>

            <Stack direction="row" spacing={1.5}>
              <Link
                href="https://www.facebook.com/share/1ApPSMPiEb/"
                target="_blank"
                color="inherit"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "scale(1.2)",
                    opacity: 0.9,
                  },
                }}
              >
                <FacebookIcon fontSize={isSmall ? "small" : "medium"} sx={{ color: "#1877F2" }} />
              </Link>

              <Link
                href="https://www.instagram.com/mr.bionepal?igsh=MWZhaThlNHBhOXdl"
                target="_blank"
                color="inherit"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "scale(1.2)",
                    opacity: 0.9,
                  },
                }}
              >
                <InstagramIcon fontSize={isSmall ? "small" : "medium"} sx={{ color: "#E4405F" }} />
              </Link>

              <Link
                href="https://www.tiktok.com/@mr.bio_123"
                target="_blank"
                color="inherit"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "scale(1.2)",
                    opacity: 0.9,
                  },
                }}
              >
                <img
                  src={tiktok}
                  alt="TikTok"
                  style={{
                    width: isSmall ? "16px" : "20px",
                    height: isSmall ? "16px" : "20px",
                  }}
                />
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default TopNavbar;
