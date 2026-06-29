/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode to decode the JWT token
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../services/auth/AuthContext";
import { CustomButton } from "../../components/button/CustomButton";
import PageHeader from "../../components/pageHeader";
import { usePostLogin } from "../../hooks/login/post/usePostLogin";
import { LOGIN_PAGE_VALIDATION } from "../../utils/validations/ValidationSchema";

const LoginPage = () => {
  const methods = useForm({
    resolver: yupResolver(LOGIN_PAGE_VALIDATION),
    defaultValues: {
      username: "",
      password: "",
      remember: true,
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((show) => !show);
  const { mutate: postLogin, isPending: loadingState } = usePostLogin();

  // Auth context integration
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle login logic
  const onSubmit = (data: any) => {
    const payload = {
      username: data?.username,
      password: data?.password,
      remember: data?.remember || false,
    };

    postLogin(payload, {
      onSuccess: async (response: any) => {
        const token = response?.data?.token;
        if (token) {
          const decodedToken: any = jwtDecode(token);
          const userRoles = decodedToken?.roles;
          login(token, decodedToken?.userId || "");
          if (userRoles && userRoles.includes("ADMIN")) {
            toast.success("You have successfully logged in!");
            navigate("/admin/dashboard");
          } else {
            toast.success("You have successfully logged in!");
            navigate("/home");
          }
        } else {
          console.log("No token found in response");
        }
      },
      onError: (err: any) => {
        toast.error(`Login failed: ${err?.message || "Invalid credentials"}`);
      },
    });
  };

  // Hide the PageHeader if the URL path is "/admin-login-page"
  const isAdminLogin = location.pathname.includes("/admin-login-page");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      {/* Conditionally render PageHeader */}
      {!isAdminLogin && (
        <Box sx={{ bgcolor: "#e8f5e8", py: 4, textAlign: "center" }}>
          <PageHeader
            title="Login"
            breadcrumbs={[{ label: "Home", path: "/" }, { label: "Login" }]}
          />
        </Box>
      )}

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper
          elevation={0}
          sx={{
            padding: 4,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            bgcolor: "white",
            maxWidth: 480,
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
            {!isAdminLogin ? "Login To Continue" : "Login"}
          </Typography>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Box mb={3}>
                <Typography
                  variant="body2"
                  color="#333"
                  mb={1}
                  fontWeight="500"
                >
                  Username <span style={{ color: "#d32f2f" }}>*</span>
                </Typography>
                <TextField
                  size="small"
                  placeholder="Username or Email"
                  fullWidth
                  {...register("username")}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 5,
                      bgcolor: "#fafafa",
                    },
                  }}
                />
              </Box>

              <Box mb={3}>
                <Typography
                  variant="body2"
                  color="#333"
                  mb={1}
                  fontWeight="500"
                >
                  Password <span style={{ color: "#d32f2f" }}>*</span>
                </Typography>
                <TextField
                  placeholder="Enter Password"
                  size="small"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 5,
                      bgcolor: "#fafafa",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box mb={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register("remember")}
                      defaultChecked
                      sx={{
                        color: "#77b831",
                        "&.Mui-checked": {
                          color: "#66a721ff",
                        },
                      }}
                    />
                  }
                  label="Remember Me"
                  sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
                />
              </Box>

              <CustomButton
                type="submit"
                variant="primary"
                width="full"
                endIcon={<span>→</span>}
                disabled={loadingState}
              >
                Sign In
              </CustomButton>
              <Divider
                sx={{
                  pb: 2,
                }}
              />
              {!isAdminLogin && (
                <Box textAlign="center" mt={3}>
                  <Typography variant="body2" color="#666">
                    Don't have an account?{" "}
                    <Link
                      component="button"
                      type="button"
                      onClick={() => navigate("/home/register")}
                      sx={{
                        color: "#77b831",
                        textDecoration: "none",
                        fontWeight: "600",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Register Now
                    </Link>
                  </Typography>
                </Box>
              )}
            </form>
          </FormProvider>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
