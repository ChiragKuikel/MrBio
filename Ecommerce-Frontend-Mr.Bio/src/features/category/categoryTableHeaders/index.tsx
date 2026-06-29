/* eslint-disable @typescript-eslint/no-explicit-any */
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import { useState } from "react";

const CategoryTableHeader = ({
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
      header: "Category Name",
      accessorKey: "name",
      size: 180,
      accessorFn: (row) =>
        row.surname ? `${row.name} ${row.surname}` : row.name,
      Cell: ({ row }) => (
        <>
          {row.original.surname
            ? `${row.original.name} ${row.original.surname}`
            : row.original.name}
        </>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 80,
      enableSorting: false,
      Cell: ({ row }) => {
        const isActive = row?.original?.status;
        let backgroundColor = "white";
        if (isActive === "active") {
          backgroundColor = "#C2F0D1";
        } else {
          backgroundColor = "#FFC8CA";
        }
        return (
          <div
            style={{
              backgroundColor,
              color: "grey",
              padding: "6px 8px",
              width: "fit-content",
              borderRadius: "14px",
              fontSize: "10px",
            }}
          >
            {isActive === "active" ? "Active" : "Inactive"}
          </div>
        );
      },
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
            <MoreVertIcon fontSize="small" />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenu}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 2,
                }
              }
            }}
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
                  // background: getErrorLightColor(),
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

export default CategoryTableHeader;
