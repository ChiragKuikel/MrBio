import { Box, Typography } from "@mui/material";

const FormDetails = ({ 
  label, 
  value 
}: { 
  label: string; 
  value: string | string[] 
}) => {
  return (
    <Box sx={{ 
      width: { xs: "100%" },
      mb: 2,
      // maxHeight: 150,
      // overflowY: 'auto'
    }}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          opacity: 0.8,
          mb: 0.5,
          // position: 'sticky',
          top: 0,
          backgroundColor: 'background.paper',
          zIndex: 1
        }}
      >
        {label}
      </Typography>
      
      {Array.isArray(value) ? (
        <Typography
          sx={{
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
            lineHeight: 1.5,
          }}
        >
          {value.join('\n')}
        </Typography>
      ) : (
        <Typography
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: 1.5
          }}
        >
          {value || "-"}
        </Typography>
      )}
    </Box>
  );
};

export default FormDetails;