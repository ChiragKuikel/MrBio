/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from "@hookform/resolvers/yup";
import SaveIcon from "@mui/icons-material/Save";
import { Box, DialogActions, DialogContent, Divider, FormLabel, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "../../../shared/components/button";
import CustomSwitch from "../../../shared/components/customSwitch";
import FormProvider from "../../../shared/components/form/FormProvider";
import RHFSelect from "../../../shared/components/form/RHFSelect";
import RHFTextField from "../../../shared/components/form/RHFTextField";
import { useModal } from "../../../shared/context/ModalContext";
import usePatchUserById from "../../../shared/hooks/user/patch/usePatchUserDetailsByIdAdmin";
import usePostUserByAdmin from "../../../shared/hooks/user/register/post/useCreateUserByAdmin";
import { USER_CREATE_VALIDATION } from "../../../shared/utils/validations/ValidationSchema";

const AddEditUser = ({ rowData }: any) => {
  const { closeModal } = useModal();
  const { mutate: postNewUserData } = usePostUserByAdmin(closeModal);
  const { mutate: patchNewUserData } = usePatchUserById(rowData?.id, closeModal);

  const [isActive, setIsActive] = useState(true);
  const genderOptions = [
    { id: "male", name: "Male" },
    { id: "female", name: "Female" },
    { id: "others", name: "Others" }
  ];

  const roleOptions = [
    { id: "USER", name: "User" },
    { id: "ADMIN", name: "Admin" }
  ];

  useEffect(() => {
    if (rowData) {
      setIsActive(rowData?.status === "active");
    }
  }, [rowData]);

  const handleSwitchToggle = () => {
    setIsActive((prev: any) => !prev);
  };

  const methods = useForm<any>({
    values: rowData
      ? {
        ...rowData,
        roleCodes: rowData.roles || [""],
        status: rowData.status || "inactive",
      }
      : {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        dob: "",
        gender: "",
        password: "",
        phones: [{ value: "", countryCode: "", countryISO: "", type: "cell" }],
        address: {
          zip: "",
          city: "",
          state: "",
          line1: "",
          line2: "",
        },
        roleCodes: [""],
      },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(USER_CREATE_VALIDATION, {
      context: { isEditMode: !!rowData }, // true if editing
    }),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (formData: any) => {
    const status = isActive ? "active" : "inactive";

    const payload = {
      ...formData,
      status,
    };
    if (rowData) {
      patchNewUserData(payload);
    } else {
      postNewUserData(payload);
    }

  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Personal Information Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'green' }}>
              Personal Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <RHFTextField name="firstName" customLabel="First Name" required />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <RHFTextField name="middleName" customLabel="Middle Name" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <RHFTextField name="lastName" customLabel="Last Name" required />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <RHFTextField name="email" customLabel="Email" required />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <RHFTextField name="dob" customLabel="Date of Birth" required />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <RHFSelect
                  name="gender"
                  customLabel="Gender"
                  required
                  options={genderOptions}
                  placeholder="Select Gender"
                // dropDownLabel="Choose Gender"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Account Information Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'green' }}>
              Account Information
            </Typography>
            <Grid container spacing={1.5}>
              {!rowData && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <RHFTextField
                    name="password"
                    customLabel="Password"
                    type="password"
                    required
                  />
                </Grid>

              )}
              <Grid size={{ xs: 12, md: 6 }}>
                <RHFSelect
                  name="roleCodes[0]"
                  customLabel="Role Code"
                  required
                  options={roleOptions}
                  placeholder="Select Role"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormLabel sx={{ fontWeight: "bold", display: "block", mb: "6px" }}>
                  Status
                </FormLabel>
                <CustomSwitch
                  isStatusActive={isActive}
                  switchFn={handleSwitchToggle}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Contact Information Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'green' }}>
              Contact Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <RHFTextField
                  name="phones[0].value"
                  customLabel="Phone Number"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <RHFTextField
                  name="phones[0].countryISO"
                  customLabel="Country Code"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <RHFTextField
                  name="phones[0].countryCode"
                  customLabel="Country ISO"
                  required
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Address Information Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'green' }}>
              Address Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <RHFTextField
                  name="address.line1"
                  customLabel="Address Line 1"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <RHFTextField name="address.line2" customLabel="Address Line 2" />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <RHFTextField name="address.city" customLabel="City" required />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <RHFTextField name="address.state" customLabel="State" required />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <RHFTextField name="address.zip" customLabel="ZIP Code" required />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <CustomButton
          color="error"
          variant="outlined"
          size="small"
          onClick={closeModal}
        >
          Cancel
        </CustomButton>
        <CustomButton
          variant={!isSubmitting ? "contained" : "outlined"}
          size="small"
          type="submit"
          startIcon={<SaveIcon />}
        >
          Save
        </CustomButton>
      </DialogActions>
    </FormProvider>
  );
};

export default AddEditUser;