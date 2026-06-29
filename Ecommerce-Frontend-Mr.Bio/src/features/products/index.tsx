/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { Card, CardHeader, Divider, Stack, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import Modal from "../../shared/components/modal";
import PageWrapper from "../../shared/components/pageWrapper";
import SearchField from "../../shared/components/searchDebounce";
import MRTTable from "../../shared/components/table/CustomTable";
import CustomPagination from "../../shared/components/table/Pagination";
import { useModal } from "../../shared/context/ModalContext";
import useTablePagination from "../../shared/hooks/customHooks/useTablePagination";
import useDeleteProductById from "../../shared/hooks/products/delete/useDeleteProductById";
import useGetProductList from "../../shared/hooks/products/get/useGetProductList";
import AddEditProducts from "./addEditProducts";
import ProductManagementTableHeader from "./productTableHeader";

const index = () => {
  const theme = useTheme();
  const { openModal, closeModal } = useModal();
  const { mutate: deleteProduct } = useDeleteProductById();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [productsDataList, setProductsDataList] = useState<any[]>([]);

  const {
    page,
    maxResultCount,
    skipCount,
    sorting,
    handleLimitChange,
    handlePageChange,
    setSorting,
  } = useTablePagination();

  const sortingString = sorting
    .map((sort) => `${sort.id} ${sort.desc ? "desc" : "asc"}`)
    .join(",");

  const { data: productData, isLoading } = useGetProductList(
    maxResultCount,
    skipCount,
    sortingString,
    searchKeyword
  );

  const columns = ProductManagementTableHeader({
    theme,
    handleEdit: (rowData): void => {
      openModal(
        <Modal
          open={true}
          onClose={closeModal}
          title="Add Product"
          maxWidth="xl"
          children={<AddEditProducts rowData={rowData?.original} />}
        />
      );
    },
    handleDeleteData: (id: string) => deleteProduct(id),
  });

  useEffect(() => {
    if (productData) {
      setProductsDataList(productData?.data?.rows ?? []);
    }
  }, [productData]);
const totalCount = productData?.data?.metaInfo?.totalCount
  return (
    <>
      <PageWrapper
        title="Product Management"
        pageHeading="Product Management"
        buttonText={"Add Product"}
        hasButton={true}
        onBtnClick={() =>
          openModal(
            <Modal
              open={true}
              onClose={closeModal}
              title="Add Product"
              maxWidth="xl"
              children={<AddEditProducts />}
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
              title="Products"
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
            data={productsDataList || []}
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

export default index;
