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
import useTablePagination from "../../shared/hooks/customHooks/useTablePagination";
import useDeleteUserById from "../../shared/hooks/user/delete/useDeleteUserById";
import useGetUserLists from "../../shared/hooks/user/get/useGetUserLists";
import AddEditUser from "./addEditUser";
import UserTableHeader from "./userHeaders";

const CategoryPage = () => {
  const theme = useTheme();
  const { openModal, closeModal } = useModal();
  const { mutate: deleteUserById } = useDeleteUserById();
  const [useDataListsList, setuseDataListsList] = useState<any[]>([]);
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
  const columns = UserTableHeader({
    theme,
    handleEdit: (rowData): void => {
      openModal(
        <Modal
          open={true}
          onClose={closeModal}
          title="Add User"
          children={<AddEditUser rowData={rowData?.original}/>}
          maxWidth={'lg'}
        />
      );
    },
    handleDeleteData: (id: string) => deleteUserById(id),
  });
  const sortingString = sorting
    .map((sort) => `${sort.id} ${sort.desc ? "desc" : "asc"}`)
    .join(",");
  const { data: useDataLists, isLoading } = useGetUserLists(
    maxResultCount,
    skipCount,
    sortingString,
    searchKeyword
  );

  useEffect(() => {
    if (useDataLists) {
      setuseDataListsList(useDataLists?.data?.rows ?? []);
    }
  }, [useDataLists]);
  const totalCount = useDataLists?.data?.metaInfo?.totalCount
  return (
    <>
      <PageWrapper
        title="User Management"
        pageHeading="User Management"
        buttonText={"Add User"}
        hasButton={true}
        onBtnClick={() =>
          openModal(
            <Modal
              open={true}
              onClose={closeModal}
              title="Add User"
              children={<AddEditUser />}
              maxWidth={'lg'}
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
              title="User Details"
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
            data={useDataListsList}
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
