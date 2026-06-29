/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IconButton,
  Popover,
  MenuItem,
  ListItemButton,
  Box,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useActionMenuContext } from "../../context/TableMenuContext";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

interface ActionContainerProps {
  buttonId: string;
  exportFile?: boolean;
  children: React.ReactNode;
  isDisabled?: boolean;
}

const ActionContainer: React.FC<ActionContainerProps> = ({
  buttonId,
  exportFile = false,
  children,
  isDisabled = false,
}) => {
  const { isOpen, openPopover, closePopover } = useActionMenuContext();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const currentTarget = event.currentTarget;
    if (!isOpen(buttonId)) {
      openPopover(buttonId);
      setAnchorEl(currentTarget);
    } else {
      closePopover(buttonId);
      setAnchorEl(null);
    }
  };

  const handleMenuItemClick = () => {
    closePopover(buttonId);
    setAnchorEl(null);
  };

  const WrappedMenuItem: React.FC<any> = ({ onClick, ...rest }) => {
    return (
      <MenuItem
        {...rest}
        disabled={isDisabled}
        onClick={() => {
          onClick?.();
          handleMenuItemClick();
        }}
      />
    );
  };

  const renderChildrenWithOnClick = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === MenuItem || child.type === ListItemButton) {
        return <WrappedMenuItem {...(typeof child.props === "object" ? child.props : {})} />;
      }
    }
    return child;
  });

  return (
    <Box sx={{ textAlign: "right" }}>
      <IconButton
        onClick={handleButtonClick}
        sx={{ padding: exportFile ? 0 : "auto" }}
      >
        {exportFile ? (
          <Button
            href=""
            target="_blank"
            size="small"
            rel="noopener noreferrer"
            variant="contained"
            startIcon={<FileDownloadOutlinedIcon />}
          >
            Export
          </Button>
        ) : (
          <MoreVertIcon fontSize="small" />
        )}
      </IconButton>
      <Popover
        open={isOpen(buttonId)}
        anchorEl={anchorEl}
        onClose={() => closePopover(buttonId)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "&.MuiPopover-root": {
            backdropFilter: "blur(0)",
          },
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              p: 1,
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 14,
                right: -5,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(0) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
      >
        {renderChildrenWithOnClick}
      </Popover>
    </Box>
  );
};

export default ActionContainer;
