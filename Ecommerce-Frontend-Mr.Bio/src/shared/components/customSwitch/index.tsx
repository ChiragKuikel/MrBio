/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from "react";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import Switch, { SwitchProps } from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

// Custom SwitchUI component
const SwitchUI = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "& .MuiSwitch-input": {
      width: "200%",
      left: "-3%",
    },
    "&.Mui-checked": {
      "& .MuiSwitch-input": {
        left: "-85%",
      },
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
      ".MuiSwitch-thumb": {
        backgroundColor: "#fff",
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

// Styled FormGroup for layout
const StyledFormGroup = styled(FormGroup)({
  "&.MuiFormGroup-root": {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "nowrap",
    marginLeft: -10,
  },
});

// Custom Switch Component with optional props and status
export const CustomSwitch: React.FC<
  SwitchProps & {
    label?: string;
    isStatusActive?: boolean;
    switchFn?: any;
    showStatus?: boolean;
  }
> = ({
  label = "", // Default to empty string if not provided
  isStatusActive = false, // Default to false if not provided
  switchFn = () => {}, // Default to no-op function if not provided
  showStatus = true, // Default to true to show the status
  ...rest
}) => {
  const [isActive, setIsActive] = React.useState(isStatusActive);

  React.useEffect(() => {
    setIsActive(isStatusActive);
  }, [isStatusActive]);

  return (
    <StyledFormGroup>
      <SwitchUI sx={{ m: 1 }} checked={isActive} onClick={switchFn} {...rest} />
      {label && <Typography>{label}</Typography>}{" "}
      {/* Only render label if it's provided */}
      {showStatus &&
        (isActive ? (
          <Typography color="green">Active</Typography>
        ) : (
          <Typography color="error">Inactive</Typography>
        ))}
    </StyledFormGroup>
  );
};

export default CustomSwitch;
