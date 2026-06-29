/* eslint-disable @typescript-eslint/no-explicit-any */
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import { useState } from "react";

const ProductManagementTableHeader = ({
  theme,
  handleEdit,
  handleDeleteData,
  skipCount,
}: {
  theme: any;
  handleEdit: (row: any) => void;
  handleDeleteData: (id: string) => void;
  tableData?: any[];
  skipCount?: number;
}): MRT_ColumnDef<any>[] => {
  const getErrorColor = () => {
    try {
      return theme?.palette?.error?.main || "#d32f2f";
    } catch (e) {
      console.error("Error accessing theme.palette.error.main:", e);
      return "#d32f2f";
    }
  };
  const columns: MRT_ColumnDef<any>[] = [
    {
      header: "S.No",
      size: 50,
      muiTableBodyCellProps: {
        align: "center",
      },
      muiTableHeadCellProps: {
        align: "center",
      },
      accessorKey: "sn",
      enableSorting: false,
      Cell: ({ row }) => row.index + 1 + (skipCount || 0),
    },
    {
      header: "Product Name",
      accessorKey: "name",
      size: 180,
      accessorFn: (row) => (
        <>{row.surname ? `${row.name} ${row.surname}` : row.name}</>
      ),
    },
    {
      header: "Product Details",
      accessorKey: "description",
      size: 150,
      enableSorting: false,
      Cell: ({ cell }: { cell: any }) => {
        const value = cell.getValue();
        return value?.length > 20 ? `${value.substring(0, 20)}...` : value;
      },
    },
    {
      header: "Remaining Stock",
      accessorKey: "stock",
      enableSorting: false,
      size: 30,
    },
    {
      header: "Actual Price",
      accessorKey: "price",
      enableSorting: false,
      size: 30,
    },
    {
      header: "Discount Price",
      accessorKey: "discount",
      enableSorting: false,
      size: 30,
    },
    {
      header: "Final Price",
      accessorKey: "finalPrice",
      enableSorting: false,
      size: 30,
    },
  ];

  const actionColumn: MRT_ColumnDef<any> = {
    header: "Action",
    accessorKey: "actions",
    size: 4,
    enableSorting: false,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      style: { textAlign: "center" },
    },
    Cell: ({ row }: any) => {
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
      const openMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
      };
      const closeMenu = () => {
        setAnchorEl(null);
      };
      return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={openMenu} variant="text" size="small">
            <MoreVertIcon fontSize="small" />{" "}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenu}
          >
            <MenuItem
              onClick={() => {
                handleEdit(row);
                closeMenu();
              }}
            >
              <EditTwoToneIcon fontSize="small" />
              <Box sx={{ ml: 1 }}>Edit</Box>
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleDeleteData(row?.original?.id);
                closeMenu();
              }}
              sx={{
                "&:hover": {
                  color: getErrorColor(),
                },
                color: getErrorColor(),
              }}
            >
              <DeleteTwoToneIcon fontSize="small" />
              <Box sx={{ ml: 1 }}>Delete</Box>
            </MenuItem>
          </Menu>
        </Box>
      );
    },
  };

  // Append the "Action" column last
  return [...columns, actionColumn];
};

export default ProductManagementTableHeader;
