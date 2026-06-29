/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { toastMessage } from '../toast/ToastMessage';

const theme = createTheme();

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  subtitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  subtitle,
  onConfirm,
  onCancel,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Dialog 
        open={open} 
        onClose={onCancel} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            textAlign: 'center'
          }
        }}
      >
        <DialogContent sx={{ px: 4, py: 3 }}>
          {/* Warning Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '3px solid #FFB366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              backgroundColor: 'white'
            }}
          >
            <Typography
              sx={{
                fontSize: 40,
                fontWeight: 'bold',
                color: '#FFB366',
                lineHeight: 1
              }}
            >
              !
            </Typography>
          </Box>

          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#666',
              mb: 2,
              fontSize: '1.5rem'
            }}
          >
            {title}
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              color: '#999',
              fontSize: '0.95rem',
              lineHeight: 1.4
            }}
          >
            {subtitle}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 2, px: 4 }}>
          <Button
            onClick={onCancel}
            variant="contained"
            sx={{
              backgroundColor: '#B0B0B0',
              color: 'white',
              fontWeight: 500,
              px: 4,
               py: 0.8,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              minWidth: 100,
              '&:hover': {
                backgroundColor: '#999'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#E55A4F',
              color: 'white',
              fontWeight: 500,
              px: 4,
              py: 0.8,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              minWidth: 120,
              '&:hover': {
                backgroundColor: '#D63384'
              }
            }}
          >
            Yes, delete it!
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export const deleteConfirmation = async (
  apiRequest?: any, 
  csTitle?: string,
  csSubtitle?: string
): Promise<any> => {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const cleanup = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    const handleConfirm = async () => {
      try {
        cleanup();
        const response = await apiRequest();
        if (response) {
          toastMessage("success", "Deleted Successfully!");
        }
        resolve(response);
      } catch (error: any) {
        const errorMessage =
          error?.body?.error?.message ||
          "Something went wrong during the deletion.";
        
        toastMessage("error", errorMessage);
        resolve(undefined);
      }
    };

    const handleCancel = () => {
      cleanup();
      resolve(undefined);
    };

    root.render(
      <ConfirmationDialog
        open={true}
        title={csTitle || "Are you sure?"}
        subtitle={csSubtitle || "You will not be able to recover this !"}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  });
};