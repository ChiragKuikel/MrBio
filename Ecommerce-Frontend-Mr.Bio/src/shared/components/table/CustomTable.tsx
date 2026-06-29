/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Typography } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import Scrollbar from "../scrollbar";

const MRTTable = ({
  className,
  data,
  columns,
  rowColorCondition,
  fallbackMessage = "No records to display",
  isLoading,
  ...rest
}: any) => {
  return (
    <>
      <MaterialReactTable
        {...rest}
        columns={columns}
        data={data}
        enableSorting
        manualSorting
        isLoading
        enableColumnActions={false}
        enableColumnOrdering={false}
        enableColumnDragging={false}
        enableTopToolbar={false}
        enableToolbarInternalActions={false}
        enableBottomToolbar={false}
        enableStickyHeader
        enablePagination={false}
        muiTableContainerProps={{
          component: Scrollbar,
          sx: { height: "auto", maxWidth: "100%", overflowX: "auto" },
        }}
        muiTablePaperProps={{
          elevation: 0,
          sx: { padding: 0, margin: 0, overflowX: "auto" },
        }}
        renderBottomToolbar={() => null}
        muiTableBodyRowProps={({ row }) => ({
          sx: {
            backgroundColor:
              rowColorCondition && rowColorCondition(row.original)
                ? "lightyellow"
                : "common.white",
          },
        })}
        muiTableBodyCellProps={{
          sx: {
            padding: "10px 11px",
            height: "35px",
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            padding: "10px 12px !important",
          },
        }}
        renderEmptyRowsFallback={() => (
          <Typography sx={{ textAlign: "center", padding: "15px 0" }}>
            <strong>{fallbackMessage}</strong>
          </Typography>
        )}
      />
    </>
  );
};

export default MRTTable;
