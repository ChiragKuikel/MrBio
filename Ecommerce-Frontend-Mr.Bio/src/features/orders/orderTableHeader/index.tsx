/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Menu, MenuItem, Chip } from "@mui/material";
import { MoreVerticalIcon } from "lucide-react";
import { type MRT_ColumnDef } from "material-react-table";
import { useState } from "react";

interface OrderManagementTableHeaderProps {
  theme: any;
  handleEdit: (row: any) => void;
  handleDeleteData?: (id: number) => void;
  routeUrl: any;
  tableData?: any[];
  skipCount?: number;
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

const OrderManagementTableHeader = ({
  theme,
  handleEdit,
  // handleDeleteData,
  // routeUrl,
  skipCount = 0,
}: OrderManagementTableHeaderProps): MRT_ColumnDef<any>[] => {
  // Serial Number Column
  const serialNumberColumn: MRT_ColumnDef<any> = {
    header: "S.No",
    accessorKey: "sn",
    size: 50,
    enableSorting: false,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    Cell: ({ row }) => row.index + 1 + skipCount,
  };

  // Client Name Column
  const clientNameColumn: MRT_ColumnDef<any> = {
    header: "Client Name",
    accessorKey: "contact.name",
    size: 150,
    enableSorting: false,
    Cell: ({ row }) => {
      const contact = row.original?.contact as ContactInfo;
      return contact?.name || <span style={{ color: theme?.palette?.text?.secondary }}>-</span>;
    },
  };

  // Client Email Column
  const clientEmailColumn: MRT_ColumnDef<any> = {
    header: "Email",
    accessorKey: "contact.email",
    size: 180,
    enableSorting: false,
    Cell: ({ row }) => {
      const contact = row.original?.contact as ContactInfo;
      return contact?.email || <span style={{ color: theme?.palette?.text?.secondary }}>-</span>;
    },
  };

  // Client Phone Column
  const clientPhoneColumn: MRT_ColumnDef<any> = {
    header: "Phone",
    accessorKey: "contact.phone",
    size: 140,
    enableSorting: false,
    Cell: ({ row }) => {
      const contact = row.original?.contact as ContactInfo;
      return contact?.phone || <span style={{ color: theme?.palette?.text?.secondary }}>-</span>;
    },
  };

  // Delivery Location Column
  const deliveryLocationColumn: MRT_ColumnDef<any> = {
    header: "Delivery Location",
    accessorKey: "shippingAddress",
    size: 180,
    enableSorting: false,
  };

  // Order Status Column with Chip
  const orderStatusColumn: MRT_ColumnDef<any> = {
    header: "Order Status",
    accessorKey: "status",
    size: 150,
    enableSorting: false,
    Cell: ({ row }) => {
      const status = row.original?.status;
      
      if (!status) {
        return <span style={{ color: theme?.palette?.text?.secondary }}>-</span>;
      }

      // Define status colors and variants
      const getStatusChipProps = (status: string) => {
        const statusLower = status.toLowerCase();
        
        switch (statusLower) {
          case 'pending':
            return { 
              color: 'warning' as const, 
              variant: 'filled' as const 
            };
          case 'processing':
            return { 
              color: 'info' as const, 
              variant: 'filled' as const 
            };
          case 'shipped':
            return { 
              color: 'primary' as const, 
              variant: 'filled' as const 
            };
          case 'delivered':
            return { 
              color: 'success' as const, 
              variant: 'filled' as const 
            };
          case 'cancelled':
            return { 
              color: 'error' as const, 
              variant: 'filled' as const 
            };
          case 'returned':
            return { 
              color: 'secondary' as const, 
              variant: 'outlined' as const 
            };
          default:
            return { 
              color: 'default' as const, 
              variant: 'filled' as const 
            };
        }
      };

      const chipProps = getStatusChipProps(status);

      return (
        <Chip
          label={status}
          size="small"
          {...chipProps}
          sx={{
            fontWeight: 500,
            textTransform: 'capitalize',
            minWidth: 80,
          }}
        />
      );
    },
  };

  // Action Column with Menu
  const actionColumn: MRT_ColumnDef<any> = {
    header: "Action",
    accessorKey: "actions",
    size: 80,
    enableSorting: false,
    muiTableHeadCellProps: { 
      align: "center" 
    },
    muiTableBodyCellProps: { 
      style: { textAlign: "center" } 
    },
    Cell: ({ row }) => {
      const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
      const isMenuOpen = Boolean(anchorEl);

      const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
      };

      const handleMenuClose = () => {
        setAnchorEl(null);
      };

      const handleEditClick = () => {
        handleEdit(row.original);
        handleMenuClose();
      };

      return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={handleMenuOpen}
            variant="text"
            size="small"
            sx={{
              minWidth: "auto",
              padding: "4px 8px",
              borderRadius: 1,
              "&:hover": {
                backgroundColor: theme?.palette?.action?.hover,
              },
            }}
            aria-label="More options"
            aria-controls={isMenuOpen ? "row-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isMenuOpen ? "true" : undefined}
          >
            <MoreVerticalIcon size={16} />
          </Button>
          
          <Menu
            id="row-menu"
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                boxShadow: theme?.shadows?.[3],
                borderRadius: 1,
                minWidth: 160,
              },
            }}
          >
            <MenuItem
              onClick={handleEditClick}
              sx={{
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: theme?.palette?.action?.hover,
                },
              }}
            >
              Update Order Details
            </MenuItem>
          </Menu>
        </Box>
      );
    },
  };

  // Return all columns in order
  return [
    serialNumberColumn,
    clientNameColumn,
    clientEmailColumn,
    clientPhoneColumn,
    deliveryLocationColumn,
    orderStatusColumn,
    actionColumn,
  ];
};

export default OrderManagementTableHeader;