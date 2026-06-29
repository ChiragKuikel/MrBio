import { useState } from "react";

export interface SortingState {
  id: string;
  desc: boolean;
}

const useTablePagination = () => {
  const [maxResultCount, setMaxResultCount] = useState(20);
  const [page, setPage] = useState(0); // Change to 0-based index
  const [skipCount, setSkipCount] = useState(0);
  const [sorting, setSorting] = useState<SortingState[]>([]);

  const handlePageChange = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void => {
    setPage(newPage + 1);
    setSkipCount(maxResultCount * newPage); // Remove -1 adjustment
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newMaxResultCount = parseInt(event.target.value, 10);
    setMaxResultCount(newMaxResultCount);
    setPage(0); // Reset to first page (index 0)
    setSkipCount(0);
  };

  const handleSortingChange = (updater: SortingState[]): void => {
    setSorting(updater);
  };

  return {
    maxResultCount,
    skipCount,
    page,
    sorting,
    handleLimitChange,
    handlePageChange,
    handleSortingChange,
    setSorting,
  };
};

export default useTablePagination;