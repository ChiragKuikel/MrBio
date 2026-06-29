/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type ChangeEvent, type ElementType } from "react";
import { TablePagination } from "@mui/material";

interface Props {
  component: ElementType<any>;
  count: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;
  onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
}

const CustomPagination = (props: Props): React.ReactElement => {
  const {
    component,
    count,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    rowsPerPageOptions,
  } = props;

  return (
    <TablePagination
      component={component}
      count={count}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={rowsPerPageOptions}
      sx={{ mt: 1 }}
    />
  );
};

export default CustomPagination;
