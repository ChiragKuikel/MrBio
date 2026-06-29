import ClearIcon from "@mui/icons-material/Clear";
import {
  Dialog,
  DialogTitle,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

// Import DialogProps using a type-only import
import type { DialogProps } from "@mui/material";

interface ModalProps extends DialogProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  maxWidth ,
  ...rest
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth={maxWidth}
      open={open}
      fullWidth={true}
      aria-labelledby="giblModal"
    >
      <DialogTitle id="giblModal">
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant="body1">{rest?.title}</Typography>
          <ClearIcon sx={{ cursor: "pointer" }} onClick={onClose} />
        </Stack>
      </DialogTitle>
      <Divider />
      {children}
    </Dialog>
  );
};

export default Modal;
