import { Box, Container, styled } from "@mui/material";
import { FC, ReactNode } from "react";

const PageTitle = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(0)} 0;
`
);

interface PageTitleWrapperProps {
  children?: ReactNode;
}

const PageTitleWrapper: FC<PageTitleWrapperProps> = ({ children }) => {
  return (
    <PageTitle className="MuiPageTitle-wrapper" sx={{mb:4}}>
      <Container maxWidth={"xl"} >{children}</Container>
    </PageTitle>
  );
};

export default PageTitleWrapper;
