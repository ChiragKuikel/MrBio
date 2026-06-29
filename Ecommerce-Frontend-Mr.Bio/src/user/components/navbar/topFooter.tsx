import ChatIcon from '@mui/icons-material/Chat';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import {
    Box,
    Container,
    Grid,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import moonlight_logo from "../../../assets/images/moonlight_logo.png";
import { COLOR_PALLETE } from '../../constants/Theme';

const TopFooter = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box 
      sx={{ 
        backgroundColor: `${COLOR_PALLETE?.LIGHT_GREY}`, 
        color: 'white',
        py: 8,
        mt: 'auto',
        borderBottom: 'solid 1px'
      }}
    >
      <Container maxWidth="lg">
        {/* Logo Section */}
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            mb: 6
          }}
        >
         <Box
          component="img"
          src={moonlight_logo}
          alt="Logo"
          sx={{ height: 100, width: "auto" }}
        />
        </Box>
        
        {/* Contact Information */}
        <Grid 
          container 
          spacing={isMobile ? 4 : 6} 
          justifyContent="center"
          alignItems="center"
        >
          {/* Phone */}
          <Grid 
          size={{xs:12, md:4}}
            sx={{ 
              display: 'flex', 
              justifyContent: isMobile ? 'center' : 'flex-end',
              alignItems: 'center'
            }}
          >
            <PhoneIcon sx={{ fontSize: 28, mr: 2, color: 'white' }} />
            <Typography variant="body1">0212 123 45 67</Typography>
          </Grid>
          
          {/* Email */}
          <Grid 
            size={{xs:12, md:4}} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <ChatIcon sx={{ fontSize: 28, mr: 2, color: 'white' }} />
            <Typography variant="body1">demo@divi.express</Typography>
          </Grid>
          
          {/* Location */}
          <Grid 
           size={{xs:12, md:4}}
            sx={{ 
              display: 'flex', 
              justifyContent: isMobile ? 'center' : 'flex-start',
              alignItems: 'center'
            }}
          >
            <LocationOnIcon sx={{ fontSize: 28, mr: 2, color: 'white' }} />
            <Typography variant="body1">Washington USA</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TopFooter;