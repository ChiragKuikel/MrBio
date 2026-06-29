import { EmojiNature, Lock } from '@mui/icons-material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Box, Grid } from '@mui/material';
import FeatureItem from './card';
const featureData = [
  {
    icon: ShoppingCartOutlinedIcon,
    title: 'Order Online',
    description: 'Order products via mobile',
  },
  {
    icon: LocalShippingOutlinedIcon,
    title: 'Fast Shipping',
    description: 'Fast shipping facilities',
  },
  {
    icon: EmojiNature,
    title: 'Quality Products',
    description: 'Find quality bio products',
  },
  {
    icon: Lock,
    title: 'Safe Payment',
    description: 'Safe and protected online payment',
  },
];

const FeatureSection = () => {
  return (
    <Box sx={{ padding: '2rem 0' }}>
      <Grid container spacing={4} justifyContent="center">
        {featureData?.map((feature, index) => (
          <Grid 
            // item  // Marks this as a grid item
            container={false} // Explicitly not a container
            component="div" // Specifies DOM element type
            size={{xs:12, sm:3}}
            key={index}
          >
            <FeatureItem
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default FeatureSection;
