// CustomButton.tsx
import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  size="small",
  onClick,
  sx = {},
  ...rest
}) => {
  const customStyles =
    color === 'primary'
      ? {
          backgroundColor: '#2E7D32',
          '&:hover': {
            backgroundColor: '#2E7D32',
          },
        }
      : {};

  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      size={size}
      sx={{
        borderRadius: '8px',
        textTransform: 'none',
        boxShadow: 'none',
        fontWeight: 'bold',
        ...customStyles,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
