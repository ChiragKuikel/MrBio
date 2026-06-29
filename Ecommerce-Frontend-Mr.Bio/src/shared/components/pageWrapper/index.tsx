import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { Box, Button, Container, styled } from "@mui/material";
import { FC, JSX, ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";
import PageTitle from "../pageTitle";
import PageTitleWrapper from "../pageTitleWrapper";
// import ActionContainer from "../table/actionContainer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface MainWrapperProps {
  noPadding?: boolean;
}

const MainWrapper = styled(Box)<MainWrapperProps>(
  ({ theme, noPadding }) => `
  padding: ${noPadding ? "0" : `${theme.spacing(0)} 0`};
`
);

interface WithButtonProps {
  hasButton: boolean;
  exportFile?: false;
  children?: ReactNode;
  title?: string;
  pageHeading?: string;
  buttonText: string;
  icon?: JSX.Element;
  isVisible?: boolean;
  isDisabled?: boolean;
  onBtnClick: () => void;
  secondButtonDisabled?: boolean;
  secondButtonText?: string;
  secondButtonOnClick?: () => void;
  secondButtonIcon?: JSX.Element;
  hasSecondButton?: boolean;
  thirdButtonDisabled?: boolean;
  thirdButtonText?: string;
  thirdButtonOnClick?: () => void;
  thirdButtonIcon?: JSX.Element;
  hasThirdButton?: boolean;
  backButtonOnClick?: () => void;
}

interface WithoutButtonProps {
  hasButton?: false;
  exportFile?: true;
  isVisible?: boolean;
  children?: ReactNode;
  title?: string;
  pageHeading?: string;
  exportPdf?: () => void;
  exportXlsx?: () => void;
  summaryReport?: () => void;
  hasSecondButton?: false;
  hasThirdButton?: false;
  backButtonOnClick?: () => void;
}

type PageWrapperProps = WithButtonProps | WithoutButtonProps;

const PageWrapper: FC<PageWrapperProps> = (props) => {
  const { pathname } = useLocation();
  //   const theme = useTheme();
  return (
    <>
      <Helmet>
        <title>{`${props?.title} | Mr.Bio`}</title>
      </Helmet>
      {pathname !== "/dashboard" ? (
        <PageTitleWrapper>
          <PageTitle
            heading={props?.pageHeading}
            backButton={
              props?.backButtonOnClick && (
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={props.backButtonOnClick}
                />
              )
            }
            thirdButton={
              props?.hasThirdButton ? (
                <Button
                  href=""
                  target="_blank"
                  size="small"
                  disabled={props?.thirdButtonDisabled}
                  rel="noopener noreferrer"
                  variant="outlined"
                  startIcon={
                    props?.thirdButtonIcon ? (
                      props?.thirdButtonIcon
                    ) : (
                      <AddTwoToneIcon fontSize="small" />
                    )
                  }
                  sx={{ borderRadius: 2 }}
                  onClick={props?.thirdButtonOnClick}
                >
                  {props?.thirdButtonText}
                </Button>
              ) : null
            }
            secondButton={
              props?.hasSecondButton ? (
                <Button
                  href=""
                  target="_blank"
                  size="small"
                  disabled={props?.secondButtonDisabled}
                  rel="noopener noreferrer"
                  variant="outlined"
                  startIcon={
                    props?.secondButtonIcon ? (
                      props?.secondButtonIcon
                    ) : (
                      <AddTwoToneIcon fontSize="small" />
                    )
                  }
                  sx={{ borderRadius: 2 }}
                  onClick={props?.secondButtonOnClick}
                >
                  {props?.secondButtonText}
                </Button>
              ) : null
            }
            button={
              props?.hasButton ? (
                <Button
                  href=""
                  target="_blank"
                  size="small"
                  disabled={props?.isDisabled}
                  rel="noopener noreferrer"
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                  startIcon={
                    props?.icon ? (
                      props?.icon
                    ) : (
                      <AddTwoToneIcon fontSize="small" />
                    )
                  }
                  onClick={props?.onBtnClick}
                >
                  {props?.buttonText}
                </Button>
              ) : null
            }
            // exportFile={
            //   props?.isVisible && props?.exportFile ? (
            //     <ActionContainer buttonId={"1"} exportFile={props?.exportFile}>
            //       <MenuItem
            //         onClick={props?.exportPdf}
            //         sx={{
            //           "&:hover": {
            //             background: theme.colors.primary.lighter,
            //             color: theme.palette.primary.main,
            //           },
            //           color: theme.palette.primary.main,
            //         }}
            //       >
            //         <PictureAsPdfOutlinedIcon />{" "}
            //         <Box sx={{ ml: 1 }}>Email PDF</Box>
            //       </MenuItem>
            //       <MenuItem
            //         onClick={props?.exportXlsx}
            //         sx={{
            //           "&:hover": {
            //             background: theme.colors.secondary.lighter,
            //             color: theme.palette.secondary.main,
            //           },
            //           color: theme.palette.secondary.main,
            //         }}
            //       >
            //         <DescriptionOutlinedIcon />{" "}
            //         <Box sx={{ ml: 1 }}>Export XSLX</Box>
            //       </MenuItem>
            //       <MenuItem
            //         onClick={props?.summaryReport}
            //         sx={{
            //           "&:hover": {
            //             background: theme.colors.secondary.lighter,
            //             color: theme.palette.secondary.main,
            //           },
            //           color: theme.palette.secondary.main,
            //         }}
            //       >
            //         <PictureAsPdfOutlinedIcon />{" "}
            //         <Box sx={{ ml: 1 }}>Summary Report</Box>
            //       </MenuItem>
            //     </ActionContainer>
            //   ) : null
            // }
          />
        </PageTitleWrapper>
      ) : (
        ""
      )}
      <MainWrapper {...props}>
        <Container maxWidth={false}>{props?.children}</Container>
      </MainWrapper>
    </>
  );
};

export default PageWrapper;
