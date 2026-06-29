/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SaveIcon from "@mui/icons-material/Save";
import {
  DialogActions,
  DialogContent,
  FormLabel,
  Grid
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "../../../shared/components/button";
import CustomSwitch from "../../../shared/components/customSwitch";
import FormProvider from "../../../shared/components/form/FormProvider";
import RHFTextField from "../../../shared/components/form/RHFTextField";
import { useModal } from "../../../shared/context/ModalContext";
import usePatchCategory from "../../../shared/hooks/category/patch/usePatchCategoryById";
import usePostCategory from "../../../shared/hooks/category/post/usePostCategory";

const AddEditCategory = ({ rowData }: any) => {
  const { closeModal } = useModal();
  const { mutate: postCategoryData } = usePostCategory(closeModal);
  const { mutate: patchCategoryData } = usePatchCategory(closeModal);

  const [isActive, setIsActive] = useState(
    rowData?.status === "active" ? true : false
  );
  useEffect(() => {
    if (rowData) {
      setIsActive(rowData?.status === "active");
    }
  }, [rowData]);

  const handleSwitchToggle = () => {
    setIsActive((prev: any) => !prev);
  };
  const methods = useForm<any>({
    values: rowData || {
      status: "",
      code: "",
      name: "",
      description: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (formData: any) => {
    const status = isActive ? "active" : "inactive";

    const payload = {
      status,
      code: formData?.name,
      name: formData?.name,
      description: formData?.description,
    };

    if (rowData) {
      patchCategoryData({
        id: rowData?.id,
        updates: payload,
      });
    } else {
      postCategoryData(payload);
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 12 }}>
              <RHFTextField
                customLabel="Category Title"
                name="name"
                required
                placeholder="Enter Category Title"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <RHFTextField
                customLabel="Category Description"
                name="description"
                multiline={true}
                rows={4}
                required
                placeholder="Enter Category Description"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 6, sm: 6 }}>
              <FormLabel
                sx={{ fontWeight: "bold", display: "block", mb: "6px" }}
              >
                Status
              </FormLabel>
              <CustomSwitch
                isStatusActive={isActive}
                switchFn={handleSwitchToggle}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <CustomButton
            color="error"
            variant="outlined"
            size="small"
            onClick={closeModal}
            // disabled={postLoading}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant={!isSubmitting ? "contained" : "outlined"}
            size="small"
            type="submit"
            startIcon={<SaveIcon />}
            // loading={postLoading}
          >
            Save
          </CustomButton>
        </DialogActions>
      </FormProvider>
    </>
  );
};

export default AddEditCategory;
