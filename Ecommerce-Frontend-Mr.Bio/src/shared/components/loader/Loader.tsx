// material-ui
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  width: 40,
  height: 40,
  border: `4px solid ${theme.palette.primary.main}`,
  borderBottomColor: "transparent",
  borderRadius: "50%",
  animation: "$rotation 1s linear infinite",
  "@keyframes rotation": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

const LoaderWrapper = styled("div")({
  position: "fixed",
  bottom: 0,
  left: 0,
  zIndex: 1301,
  width: "100%",
});

const LoaderWrapperCover = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  height: "100%",
  background:
    "linear-gradient( 135deg, rgba(36, 46, 77, 1), rgba(137, 126, 121, 1) )",
});

type LoaderProps = {
  variant?: "circular" | "linear" | "cover";
};

const Loader = ({ variant = "linear" }: LoaderProps): React.ReactElement => (
  <>
    {variant === "linear" ? (
      <LoaderWrapper>
        <LinearProgress color="primary" />
      </LoaderWrapper>
    ) : variant === "circular" ? (
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
        <StyledCircularProgress thickness={0} />
      </Box>
    ) : variant === "cover" ? (
      <LoaderWrapperCover>
        <div className="loader"></div>
      </LoaderWrapperCover>
    ) : null}
  </>
);

export default Loader;
