/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  Card,
  CardHeader,
  Divider,
  Stack,
  useTheme,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import * as routeUrl from "../../routes/routeUrl";
import Modal from "../../shared/components/modal";
import PageWrapper from "../../shared/components/pageWrapper";
import SearchField from "../../shared/components/searchDebounce";
import MRTTable from "../../shared/components/table/CustomTable";
import CustomPagination from "../../shared/components/table/Pagination";
import { useModal } from "../../shared/context/ModalContext";
import useTablePagination from "../../shared/hooks/customHooks/useTablePagination";
import useGetOrderList from "../../shared/hooks/order/get/useGetOrderList";
import OrderManagementTableHeader from "./orderTableHeader";
import UpdateOrderDetails from "./updateOrders/updateOrderDetails";
import RHFSelect from "../../shared/components/form/RHFSelect";
import FormProvider from "../../shared/components/form/FormProvider";
import { useForm, useWatch } from "react-hook-form";

const index = () => {
  const theme = useTheme();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [orderDataList, setOrderDataList] = useState<[]>([]);
  const [orderStatus, setOrderStatus] = useState<string>("");
  const { openModal, closeModal } = useModal();
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

  const methods = useForm({
    defaultValues: {
      orderStatus: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const watchedOrderStatus = useWatch({
    control: methods.control,
    name: "orderStatus",
  });

  useEffect(() => {
    setOrderStatus(watchedOrderStatus);
  }, [watchedOrderStatus]);

  const { data: orderData, isLoading } = useGetOrderList(
    maxResultCount,
    skipCount,
    sortingString,
    searchKeyword,
    orderStatus
  );

  const columns = OrderManagementTableHeader({
    theme,
    handleEdit: (rowData): void => {
      openModal(
        <Modal
          open={true}
          onClose={closeModal}
          maxWidth="lg"
          children={<UpdateOrderDetails rowData={rowData} />}
          title="Update Product Details"
        />
      );
    },
    routeUrl: routeUrl,
  });

  useEffect(() => {
    if (orderData) {
      setOrderDataList(orderData?.data?.rows ?? []);
    }
  }, [orderData]);

  const statusOptions = [
    { id: "pending", name: "Pending" },
    { id: "processing", name: "Processing" },
    { id: "shipped", name: "Shipped" },
    { id: "delivered", name: "Delivered" },
    { id: "cancelled", name: "Cancelled" },
  ];

  const handleResetFilters = () => {
    methods.setValue("orderStatus", "");
    setSearchKeyword("");
  };

  return (
    <>
      <PageWrapper title="Order Management" pageHeading="Order Management">
        <Card sx={{ p: 2 }}>
          <Stack
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            direction={"row"}
          >
            <CardHeader
              title="Orders"
              sx={{
                flexBasis: "50%",
                "& .MuiCardHeader-title": {
                  fontWeight: 600,
                  fontSize: "16px",
                },
              }}
            />
            <FormProvider methods={methods}>
              <RHFSelect
                name={"orderStatus"}
                dropDownLabel={"Filter By Status"}
                options={statusOptions}
                customLabel={""}
              />
            </FormProvider>
            <Button variant="outlined" onClick={handleResetFilters} sx={{ marginLeft: 2, paddingRight:2}}>
              Reset
            </Button>
            <SearchField valueSetter={setSearchKeyword} sx={{ padding: 2 }} />
          </Stack>
          <Divider />
          <MRTTable
            columns={columns}
            data={orderDataList || []}
            state={{
              isLoading: isLoading,
              sorting: sorting,
            }}
            onSortingChange={setSorting}
          />
          <Divider />
          <CustomPagination
            count={0}
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