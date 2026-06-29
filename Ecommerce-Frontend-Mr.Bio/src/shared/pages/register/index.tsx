/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { CustomButton } from "../../components/button/CustomButton";
import FormProvider from "../../components/form/FormProvider";
import RHFDatePicker from "../../components/form/RHFDatePicker";
import { RHFRadioGroup } from "../../components/form/RHFRadio";
import RHFTextField from "../../components/form/RHFTextField";
import PageHeader from "../../components/pageHeader";
import { toastMessage } from "../../components/toast/ToastMessage";
import useCreateNewUser from "../../hooks/user/register/post/useCreateUser";

// Validation schema using yup
const validationSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  dob: yup.string().required("Date of birth is required"),
  phones: yup
    .array()
    .of(
      yup.object({
        value: yup.string().required("Phone number is required"),
        countryCode: yup.string().required("Country code is required"),
        countryISO: yup.string().required("Country ISO is required"),
        type: yup.string().default("cell"),
      })
    )
    .required("At least one phone number is required"),
  gender: yup.string().required("Gender is required"),
  middleName: yup.string().notRequired(),
  address: yup.object({
    zip: yup.string().required("Zip code is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    line1: yup.string().required("Address line 1 is required"),
    line2: yup.string().optional(),
  }),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  roleCodes: yup
    .array()
    .of(yup.string().required())
    .required("Role is required"),
});

// Define the form data type
interface Phone {
  value: string;
  countryCode: string;
  countryISO: string;
  type: string;
}

interface Address {
  zip: string;
  city: string;
  state: string;
  line1: string;
  line2?: string;
}

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  phones: Phone[];
  gender: string;
  middleName?: string;
  address: Address;
  password: string;
  roleCodes: string[];
}

// Define default values as a constant to ensure consistency
const defaultValues: RegistrationFormData = {
  firstName: "",
  lastName: "",
  email: "",
  dob: "",
  phones: [{ value: "", countryCode: "Nepal(NP)", countryISO: "+977", type: "cell" }],
  gender: "male", // Ensure this is always a valid string
  middleName: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
  },
  password: "",
  roleCodes: [], // Changed from [""] to [] - empty array instead of array with empty string
};

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate: postNewUser } = useCreateNewUser();

  const onSubmit = (data: RegistrationFormData) => {
  const payload = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    dob: data.dob,
    phones: data.phones.map((phone: Phone) => ({
      ...phone,
      type: phone.type || "cell", // Ensure phone type is always set
    })),
    gender: data.gender,
    middleName: data.middleName || "", // Handle optional middleName
    address: {
      ...data.address,
    },
    password: data.password,
    roleCodes: ["USER"],
  };
  
  // Actually call the mutation to create user
  postNewUser(payload,{
    onSuccess: () => {
      navigate("/home/login");
    },
    onError: (error) => {
      toastMessage("error", "Failed to create user: " + error?.displayMessage);
    },
  });
};


  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const methods = useForm<any>({
    defaultValues, // Use defaultValues instead of values
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      {/* Page Header */}
      <Box sx={{ bgcolor: "#e8f5e8", py: 4, textAlign: "center" }}>
        <PageHeader
          title="Register"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Register" }]}
        />
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper
          elevation={0}
          sx={{
            padding: 4,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            bgcolor: "white",
            maxWidth: 800,
            mx: "auto",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            color="#333"
            mb={4}
            textAlign="center"
          >
            Create Your Account
          </Typography>
          {/* Registration Form */}
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* First Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="firstName"
                  customLabel="First Name"
                  required
                />
              </Grid>

              {/* Last Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="lastName"
                  customLabel="Last Name"
                  required
                />
              </Grid>

              {/* Email */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="email" customLabel="Email" required />
              </Grid>

              {/* Password */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="password"
                  customLabel="Password"
                  required
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Date of Birth */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFDatePicker
                  name="dob"
                  customLabel="Date of Birth"
                  required
                  disableFuture 
                />
              </Grid>

              {/* Phone Number */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="phones.0.value"
                  customLabel="Phone Number"
                  required
                />
              </Grid>

              {/* Country Code */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="phones.0.countryCode"
                  customLabel="Country Code"
                  required
                  disabled
                />
              </Grid>

              {/* Country ISO */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="phones.0.countryISO"
                  customLabel="Country ISO"
                  required
                  disabled
                />
              </Grid>

              {/* Gender */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFRadioGroup
                  name="gender"
                  customlabel="Gender"
                  required
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                />
              </Grid>

              {/* Address Information */}
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <Typography variant="h6" color="#333" fontWeight="600" mb={2}>
                  Address Information
                </Typography>
              </Grid>

              {/* Address Line 1 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="address.line1"
                  customLabel="Current Address"
                  required
                />
              </Grid>

              {/* Address Line 2 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="address.line2"
                  customLabel="Permanent Address (optional)"
                />
              </Grid>

              {/* City */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="address.city" customLabel="City" required />
              </Grid>

              {/* State */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="address.state"
                  customLabel="State"
                  required
                />
              </Grid>

              {/* Zip */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="address.zip"
                  customLabel="Zip Code"
                  required
                />
              </Grid>

              {/* Submit Button */}
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <CustomButton
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  width="full"
                >
                  Create Account
                </CustomButton>
              </Grid>

              {/* Login Link */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box textAlign="center" mt={3}>
                  <Typography variant="body2" color="#666">
                    Already have an account?{" "}
                    <Link
                      component="button"
                      onClick={() => navigate("/home/login")}
                      sx={{
                        color: "#77b831",
                        textDecoration: "none",
                        fontWeight: "600",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Login Now
                    </Link>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </FormProvider>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegistrationForm;