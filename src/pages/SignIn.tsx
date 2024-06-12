import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, IconButton, InputAdornment, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import zod from "zod";
import OpennyAILogo from "../assets/OpennyaiLogo.svg";
import { LabelledInput } from "../components/LabelledInput";
import { useAuth } from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import { Styles } from "../types/styles";

const styles: Styles = {
  container: {
    height: "100vh",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "5%",
    boxSizing: "border-box",
  },
  inputLabel: { fontSize: { xs: "18px", md: "20px" } },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    width: {
      xs: "100%",
      md: "50%",
      lg: "45%",
    },
    gap: "28px",
  },
  link: (theme) => ({
    color: theme.palette.text.primary,
    fontSize: {
      xs: "14px",
      sm: "16px",
      md: "18px",
      lg: "20px",
    },
  }),
};

const SignInSchema = zod.object({
  username: zod
    .string({ required_error: "Username can't be empty" })
    .trim()
    .min(1, { message: "Username can't be empty" }),
  password: zod.string().min(1, { message: "Password can't be empty" }),
});
type SignInFields = zod.infer<typeof SignInSchema>;

export const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuth();

  const { makeRequest, status } = useAxios();

  const {
    control,
    getValues,
    formState: { isValid, isDirty },
  } = useForm<SignInFields>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const navigate = useNavigate();

  const handleSignIn = async () => {
    const { username, password } = getValues();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    try {
      const response = await makeRequest("/auth/login", "POST", formData);
      setAuth({ accessToken: response.access_token });
      navigate("/");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={{ marginBottom: "48px" }}>
        <OpennyAILogo />
      </Box>
      <Box sx={styles.formContainer}>
        <Typography variant="h5" sx={{ margin: "16px", textAlign: "center" }}>
          Welcome to Annotation UI, Please Sign in
        </Typography>
        <Controller
          name="username"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <LabelledInput
              label={<Typography sx={styles.inputLabel}>Username</Typography>}
              id="username"
              placeholder="Enter your username"
              type="text"
              variant="outlined"
              size="small"
              value={value}
              error={!!error}
              helperText={error?.message}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <LabelledInput
              label={<Typography sx={styles.inputLabel}>Password</Typography>}
              id="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              size="small"
              value={value}
              error={!!error}
              helperText={error?.message}
              onChange={onChange}
              onBlur={onBlur}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      data-testid="password-visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <LoadingButton
          variant="contained"
          type="submit"
          size="small"
          loading={status === "pending"}
          onClick={handleSignIn}
          disabled={!isDirty || !isValid}
        >
          Sign In
        </LoadingButton>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={styles.link}>
            <Link
              to="/forgot-password"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Forgot password?
            </Link>
          </Typography>
          <Typography sx={styles.link}>
            <Link
              to="/signup"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Don't have an account? Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
