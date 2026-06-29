/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import FormProvider from "../../../shared/components/form/FormProvider";
import { Button, DialogActions, DialogContent, Grid } from "@mui/material";
import RHFTextField from "../../../shared/components/form/RHFTextField";
import RHFSelect from "../../../shared/components/form/RHFSelect";
import { useModal } from "../../../shared/context/ModalContext";
import SaveIcon from "@mui/icons-material/Save";

const AddEditProducts = () => {
  const { closeModal } = useModal();
  const methods = useForm<any>({
    values: {},
    // resolver: yupResolver(ROLE_MANAGEMENT_VALIDATION) as any,
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = () => {
    console.log("");
  };
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 4, md: 4 }}>
              <RHFTextField
                customLabel="Product Title"
                name="title"
                required
                placeholder="Enter Product Title"
              />
            </Grid>
            <Grid size={{ xs: 4, md: 4 }}>
              <RHFTextField
                customLabel="Product Price (NRs.)"
                name="price"
                required
                placeholder="Enter Product Price"
              />
            </Grid>
            <Grid size={{ xs: 4, md: 4 }}>
              <RHFSelect
                required
                customLabel="Product Category"
                name="productCategroy"
                options={[]}
                placeholder="Select"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <RHFTextField
                customLabel="Product Description"
                name="detail"
                required
                multiline
                rows={5}
                placeholder="Enter Product Description"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            size="small"
            onClick={closeModal}
            // disabled={postLoading}
          >
            Cancel
          </Button>
          <Button
            variant={!isSubmitting ? "contained" : "outlined"}
            size="small"
            type="submit"
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: '#2E7D32', // Custom green color
              '&:hover': {
                backgroundColor: '#2E7D32', // Custom green color for hover
              },
            }}
            // loading={postLoading}
          >
            Save
          </Button>
        </DialogActions>
      </FormProvider>
    </>
  );
};

export default AddEditProducts;
