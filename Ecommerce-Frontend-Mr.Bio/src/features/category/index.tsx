/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardHeader,
  Divider,
  Stack,
  useTheme
} from "@mui/material";
import { useEffect, useState } from "react";
import Modal from "../../shared/components/modal";
import PageWrapper from "../../shared/components/pageWrapper";
import SearchField from "../../shared/components/searchDebounce";
import MRTTable from "../../shared/components/table/CustomTable";
import CustomPagination from "../../shared/components/table/Pagination";
import { useModal } from "../../shared/context/ModalContext";
import useDeleteCategory from "../../shared/hooks/category/delete/useDeleteCategoryById";
import useGetCategoryLists from "../../shared/hooks/category/get/useGetCategoryList";
import useTablePagination from "../../shared/hooks/customHooks/useTablePagination";
import AddEditCategory from "./addEditCategory";
import ProductManagementTableHeader from "./categoryTableHeaders";

const CategoryPage = () => {
  const theme = useTheme();
  const { openModal, closeModal } = useModal();
  const { mutate: deleteCategoryData } = useDeleteCategory();
  const [categoryDataList, setCategoryDataList] = useState<any[]>([]);
  const {
    page,
    maxResultCount,
    skipCount,
    sorting,
    handleLimitChange,
    handlePageChange,
    setSorting,
  } = useTablePagination();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const columns = ProductManagementTableHeader({
    theme,
    handleEdit: (rowData): void => {
      openModal(
        <Modal
          open={true}
          onClose={closeModal}
          title="Add Category"
          children={<AddEditCategory rowData={rowData?.original}/>}
        />
      );
    },
    handleDeleteData: (id: string) => deleteCategoryData(id),
  });
  const sortingString = sorting
    .map((sort) => `${sort.id} ${sort.desc ? "desc" : "asc"}`)
    .join(",");
  const { data: categoryData, isLoading } = useGetCategoryLists(
    maxResultCount,
    page,
    sortingString,
    searchKeyword
  );
  console.log(skipCount)
  useEffect(() => {
    if (categoryData) {
      setCategoryDataList(categoryData?.data?.rows ?? []);
    }
  }, [categoryData]);
  const totalCount = categoryData?.data?.metaInfo?.totalCount
  return (
    <>
      <PageWrapper
        title="Category Management"
        pageHeading="Category Management"
        buttonText={"Add Category"}
        hasButton={true}
        onBtnClick={() =>
          openModal(
            <Modal
              open={true}
              onClose={closeModal}
              title="Add Category"
              children={<AddEditCategory />}
            />
          )
        }
      >
        <Card sx={{ p: 2 }}>
          <Stack
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            direction={"row"}
          >
            <CardHeader 
              title="Product Categories"
              sx={{
                flexBasis: "50%",
                "& .MuiCardHeader-title": {
                  fontWeight: 600,
                  fontSize: "16px",
                },
              }}
            />
            <SearchField valueSetter={setSearchKeyword} sx={{ padding: 2 }} />
          </Stack>
          <Divider />
          <MRTTable
            columns={columns}
            data={categoryDataList}
            state={{
              isLoading: isLoading,
              sorting: sorting,
            }}
            onSortingChange={setSorting}
          />
          <Divider />
          <CustomPagination
            count={totalCount || 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={maxResultCount}
            rowsPerPageOptions={[5, 10, 25, 50, 75, 100]}
            component={"div"}
          />
        </Card>
      </PageWrapper>
    </>
  );
};

export default CategoryPage;
