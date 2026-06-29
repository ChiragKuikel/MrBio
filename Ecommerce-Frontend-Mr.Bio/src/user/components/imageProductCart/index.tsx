// /* eslint-disable @typescript-eslint/no-unused-vars */
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import {
//     Box,
//     Button,
//     Card,
//     CardContent,
//     styled,
//     Typography
// } from '@mui/material';

// // Styled components for custom styling
// const StyledCard = styled(Card)(({ theme, bgcolor }) => ({
//   borderRadius: 24,
//   overflow: 'hidden',
//   background: bgcolor || theme.palette.primary.main,
//   color: 'white',
//   minHeight: 280,
//   position: 'relative',
//   cursor: 'pointer',
//   transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//   '&:hover': {
//     transform: 'translateY(-4px)',
//     boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
//   },
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   backgroundColor: '#2e7d32',
//   color: 'white',
//   borderRadius: 20,
//   textTransform: 'none',
//   fontWeight: 600,
//   padding: '8px 20px',
//   '&:hover': {
//     backgroundColor: '#1b5e20',
//   },
// }));

// const ProductImage = styled('img')({
//   width: '100%',
//   height: 'auto',
//   objectFit: 'cover',
//   position: 'absolute',
//   right: -20,
//   bottom: -10,
//   maxWidth: '60%',
// });

// const PromoCard = ({ 
//   title, 
//   subtitle, 
//   tagline, 
//   buttonText = "BUY NOW", 
//   backgroundColor, 
//   productImage, 
//   onButtonClick 
// }) => {
//   return (
//     <StyledCard bgcolor={backgroundColor}>
//       <CardContent sx={{ 
//         padding: 3, 
//         position: 'relative', 
//         zIndex: 2,
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between'
//       }}>
//         <Box>
//           <Typography 
//             variant="h6" 
//             component="h3" 
//             sx={{ 
//               fontWeight: 400, 
//               mb: 1,
//               fontSize: '1.1rem',
//               opacity: 0.9
//             }}
//           >
//             {title}
//           </Typography>
          
//           <Typography 
//             variant="h4" 
//             component="h2" 
//             sx={{ 
//               fontWeight: 700, 
//               mb: 2,
//               fontSize: { xs: '1.8rem', md: '2.2rem' },
//               lineHeight: 1.2
//             }}
//           >
//             {subtitle}
//           </Typography>
          
//           <Typography 
//             variant="body2" 
//             sx={{ 
//               opacity: 0.8, 
//               mb: 3,
//               fontSize: '0.95rem'
//             }}
//           >
//             {tagline}
//           </Typography>
//         </Box>

//         <StyledButton
//           variant="contained"
//           endIcon={<ArrowForwardIcon />}
//           onClick={onButtonClick}
//           sx={{ alignSelf: 'flex-start' }}
//         >
//           {buttonText}
//         </StyledButton>
//       </CardContent>

//       {productImage && (
//         <ProductImage 
//           src={productImage} 
//           alt="Product"
//         />
//       )}
//     </StyledCard>
//   );
// };