/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion"; // Import motion from Framer Motion
import { COLOR_PALLETE } from "../../../../constants/Theme";

const FeatureItem = ({ icon: Icon, title, description }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }} // Initial state (off-screen to the left, invisible)
      animate={{ opacity: 1, x: 0 }} // Final state (fully visible, in place)
      transition={{ duration: 0.5 }} // Duration of the animation
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        sx={{ width: '100%', padding: '1rem' }}
      >
        {/* Icon on the left with some initial scale */}
        <motion.div
          initial={{ scale: 0.8 }} // Icon starts at 80% of its size
          animate={{ scale: 1 }} // Icon grows to its full size
          transition={{ duration: 0.5 }} // Duration of the scaling effect
        >
          <Icon sx={{ fontSize: 35, marginRight: '1rem', color:`${COLOR_PALLETE?.PRIMARY_COLOR}`}} />
        </motion.div>

        {/* Text content (Title and Description) */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color:`${COLOR_PALLETE?.PRIMARY_COLOR}` }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default FeatureItem;
