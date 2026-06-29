/* eslint-disable @typescript-eslint/no-unused-vars */
import { Grid, Typography, Box } from "@mui/material"; 
import { FC, ReactNode } from "react";  

interface PageTitleProps {   
  heading?: string;   
  subHeading?: string;   
  url?: string;   
  button?: ReactNode;   
  exportFile?: ReactNode;   
  secondButton?: ReactNode;   
  backButton?: ReactNode;   
  thirdButton?: ReactNode;  
}  

const PageTitle: FC<PageTitleProps> = ({   
  heading = "",   
  subHeading = "",   
  url = "",   
  button,   
  exportFile,   
  secondButton,   
  backButton,   
  thirdButton,   
  ...rest 
}) => {   
  return (     
    <Grid       
      container       
      justifyContent="space-between"       
      alignItems="center"       
      {...rest}     
    >       
      <Grid >         
        <Box display="flex" alignItems="center">
          {backButton && (
            <Box display="inline-flex" alignItems="center" mr={1}>
              {backButton}
            </Box>
          )}
          <Box>
            <Typography variant="h6" component="h6" gutterBottom>
              {heading}
            </Typography>
            <Typography variant="subtitle2">{subHeading}</Typography>
          </Box>
        </Box>
      </Grid>        
      
      <Grid >         
        <Box display="flex" alignItems="center">           
          {secondButton && <Box mr={1}>{secondButton}</Box>}           
          {button && <Box mr={1}>{button}</Box>}           
          {thirdButton && <Box mr={1}>{thirdButton}</Box>}         
        </Box>       
      </Grid>     
    </Grid>   
  ); 
};  

export default PageTitle;