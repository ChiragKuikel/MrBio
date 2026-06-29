/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Box,
    Breadcrumbs,
    Button,
    Container,
    Link,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components for the illustration
const IllustrationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  minHeight: '300px',
  marginBottom: theme.spacing(4),
}));

const LargeText = styled(Typography)(({ theme }) => ({
  fontSize: '120px',
  fontWeight: 'bold',
  color: '#e0e0e0',
  position: 'relative',
  zIndex: 1,
  userSelect: 'none',
  lineHeight: 1,
  [theme.breakpoints.down('md')]: {
    fontSize: '80px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '60px',
  },
}));

const PersonIllustration = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 2,
  '& svg': {
    width: '200px',
    height: '200px',
    [theme.breakpoints.down('sm')]: {
      width: '150px',
      height: '150px',
    },
  },
}));

const FloatingLeaf = styled(Box)(() => ({
  position: 'absolute',
  animation: 'float 3s ease-in-out infinite',
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0px) rotate(0deg)',
    },
    '50%': {
      transform: 'translateY(-10px) rotate(5deg)',
    },
  },
}));

const PersonWithQuestionSVG = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Person body */}
    <ellipse cx="100" cy="170" rx="25" ry="8" fill="#8B4513" opacity="0.3" />
    <rect x="85" y="120" width="30" height="50" rx="15" fill="#D2691E" />
    
    {/* Person head */}
    <circle cx="100" cy="80" r="25" fill="#FDBCB4" />
    
    {/* Hair */}
    <path d="M75 70 Q100 50 125 70 Q120 65 115 68 Q105 60 100 62 Q95 60 85 68 Q80 65 75 70 Z" fill="#8B4513" />
    
    {/* Face features */}
    <circle cx="92" cy="78" r="2" fill="#333" />
    <circle cx="108" cy="78" r="2" fill="#333" />
    <path d="M95 88 Q100 92 105 88" stroke="#333" strokeWidth="2" fill="none" />
    
    {/* Arms */}
    <rect x="70" y="130" width="15" height="25" rx="7" fill="#FDBCB4" transform="rotate(-20 77.5 142.5)" />
    <rect x="115" y="130" width="15" height="25" rx="7" fill="#FDBCB4" transform="rotate(20 122.5 142.5)" />
    
    {/* Legs */}
    <rect x="90" y="165" width="8" height="25" rx="4" fill="#654321" />
    <rect x="102" y="165" width="8" height="25" rx="4" fill="#654321" />
    
    {/* Question mark */}
    <circle cx="130" cy="60" r="20" fill="#FFF" stroke="#DDD" strokeWidth="2" />
    <text x="130" y="70" textAnchor="middle" fontSize="24" fill="#666" fontWeight="bold">?</text>
  </svg>
);

type LeafSVGProps = {
  color: string;
  size?: number;
};

const LeafSVG = ({ color, size = 30 }: LeafSVGProps) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 25 Q15 5 25 15 Q20 20 15 18 Q10 22 5 25 Z" fill={color} />
  </svg>
);

type DirectionSVGProps = {
  color: string;
  rotation?: number;
};

const DirectionSVG = ({ color, rotation = 0 }: DirectionSVGProps) => (
  <svg 
    width="40" 
    height="40" 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <path d="M20 5 L35 20 L20 35 L20 25 L5 25 L5 15 L20 15 Z" fill={color} />
  </svg>
);

export default function NotFoundPage() {

  const handleBackToHome = () => {
    // In a real app, you'd use React Router or Next.js router
    window.location.href = '/';
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Header with breadcrumbs */}
      <Box sx={{ bgcolor: '#e8f5e8', py: 2, px: 3 }}>
        <Container maxWidth="lg">
          <Breadcrumbs aria-label="breadcrumb">
            <Link 
              color="primary" 
              href="/" 
              underline="hover"
              sx={{ fontSize: '14px' }}
            >
              Home
            </Link>
            <Typography color="text.primary" sx={{ fontSize: '14px' }}>
              404
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* Main content */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          {/* Large 404 text with illustration */}
          <IllustrationContainer>
            <LargeText>404</LargeText>
            
            {/* Person with question mark */}
            <PersonIllustration>
              <PersonWithQuestionSVG />
            </PersonIllustration>

            {/* Floating decorative elements */}
            <FloatingLeaf sx={{ top: '20%', left: '15%' }}>
              <LeafSVG color="#FF6B6B" size={25} />
            </FloatingLeaf>
            
            <FloatingLeaf sx={{ top: '30%', right: '20%', animationDelay: '1s' }}>
              <LeafSVG color="#4ECDC4" size={30} />
            </FloatingLeaf>
            
            <FloatingLeaf sx={{ bottom: '20%', left: '20%', animationDelay: '2s' }}>
              <LeafSVG color="#45B7D1" size={35} />
            </FloatingLeaf>
            
            <FloatingLeaf sx={{ bottom: '30%', right: '15%', animationDelay: '0.5s' }}>
              <LeafSVG color="#FFA07A" size={28} />
            </FloatingLeaf>

            <FloatingLeaf sx={{ top: '40%', left: '25%', animationDelay: '1.5s' }}>
              <DirectionSVG color="#96CEB4" rotation={45} />
            </FloatingLeaf>
            
            <FloatingLeaf sx={{ top: '50%', right: '25%', animationDelay: '2.5s' }}>
              <DirectionSVG color="#FFEAA7" rotation={-30} />
            </FloatingLeaf>
          </IllustrationContainer>

          {/* Error message */}
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: '#2c3e50',
              mb: 2,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
            }}
          >
            Page not found: /error
          </Typography>

          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 4,
              fontSize: '1.1rem',
              maxWidth: 400,
              mx: 'auto'
            }}
          >
            Please try searching for some other page.
          </Typography>

          {/* Back to home button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleBackToHome}
            sx={{
              bgcolor: '#2e7d32',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
              '&:hover': {
                bgcolor: '#1b5e20',
                boxShadow: '0 6px 16px rgba(46, 125, 50, 0.4)',
              },
              '&:active': {
                transform: 'translateY(1px)',
              }
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}