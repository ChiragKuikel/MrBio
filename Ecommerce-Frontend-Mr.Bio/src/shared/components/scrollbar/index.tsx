/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { forwardRef } from "react";
import type { ReactNode } from "react";

import { Scrollbars } from "react-custom-scrollbars-2";
import { Box, useTheme } from "@mui/material";

interface ScrollbarProps {
  className?: string;
  children?: ReactNode;
  maxHeight?: string;
}

const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ className, children, maxHeight = 360, ...rest }, ref) => {
    const theme = useTheme();

    const actualHeight = `calc(100vh - ${maxHeight}px)`;

    return (
      <Scrollbars
        autoHeight={true}
        autoHeightMax={actualHeight}
        autoHideTimeout={1000}
        autoHideDuration={200}
        renderThumbVertical={() => (
          <Box
            sx={{
              width: 5,
              background: `${theme.palette.divider}`,
              borderRadius: `${theme.shape.borderRadius}`,
              transition: `${theme.transitions.create(["background"])}`,
              "&:hover": {
                background: `${theme.palette.action.hover}`,
              },
            }}
          />
        )}
        {...rest}
        ref={ref as React.Ref<Scrollbars>} // Explicitly typing the ref for Scrollbars
      >
        {children}
      </Scrollbars>
    );
  }
);

Scrollbar.displayName = "Scrollbar"; // Add a display name for better debugging

export default Scrollbar;
